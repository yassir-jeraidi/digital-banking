import {Component, computed, effect, OnInit, signal, TrackByFunction, untracked} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {Customer} from '@core/interfaces/customer';
import {CustomersService} from '@core/services/customers.service';
import {SelectionModel} from '@angular/cdk/collections';
import {debounceTime, map} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {HlmIconDirective} from '@spartan-ng/ui-icon-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmCheckboxImports} from '@spartan-ng/ui-checkbox-helm';
import {BrnMenuTriggerDirective} from '@spartan-ng/brain/menu';
import {HlmMenuComponent, HlmMenuItemImports, HlmMenuStructureImports} from '@spartan-ng/ui-menu-helm';
import {
  BrnTableImports,
  PaginatorState,
  useBrnColumnManager
} from '@spartan-ng/brain/table';
import {HlmTableImports} from '@spartan-ng/ui-table-helm';
import {BrnSelectImports} from '@spartan-ng/brain/select';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmSelectImports} from '@spartan-ng/ui-select-helm';
import {lucideArrowUpDown, lucideChevronDown, lucideEllipsis, lucideTrash, lucidePencil , lucidePlus} from '@ng-icons/lucide';
import {provideIcons} from '@ng-icons/core';
import {NgIcon} from '@ng-icons/core';
import {RouterLink} from '@angular/router';
import {toast} from 'ngx-sonner';


@Component({
  selector: 'app-customers',
  imports: [
    FormsModule,
    BrnMenuTriggerDirective,
    HlmIconDirective,
    HlmMenuItemImports,
    HlmMenuComponent,
    BrnTableImports, HlmTableImports,
    HlmButtonDirective,
    HlmCheckboxImports,
    HlmInputDirective,
    HlmSelectImports,
    BrnSelectImports,
    HlmMenuStructureImports,
    NgIcon,
    RouterLink,
  ],
  templateUrl: './customers.component.html',
  providers: [
    provideIcons({lucideArrowUpDown, lucideChevronDown, lucideEllipsis, lucideTrash, lucidePencil , lucidePlus})
  ],
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {

  constructor(private customerService: CustomersService) {
    effect(() => {
      const debouncedFilter = this._debouncedFilter();
      untracked(() => this._emailFilter.set(debouncedFilter ?? ''));
    });
  }

  ngOnInit(): void {
    this.getAllCustomers();
  }


  protected readonly _rawFilterInput = signal('');
  protected readonly _emailFilter = signal('');
  private readonly _debouncedFilter = toSignal(toObservable(this._rawFilterInput).pipe(debounceTime(300)));

  private readonly _displayedIndices = signal({start: 0, end: 0});
  protected readonly _availablePageSizes = [5, 10, 20, 10000];
  protected readonly _pageSize = signal(this._availablePageSizes[0]);

  private readonly _selectionModel = new SelectionModel<Customer>(true);
  protected readonly _isCustomerSelected = (customer: Customer) => this._selectionModel.isSelected(customer);
  protected readonly _selected = toSignal(this._selectionModel.changed.pipe(map((change) => change.source.selected)), {
    initialValue: [],
  });

  protected readonly _brnColumnManager = useBrnColumnManager({
    name: {visible: true, label: 'Name'},
    email: {visible: true, label: 'Email'},
    actions: {visible: true, label: 'Actions'}
  });
  protected readonly _allDisplayedColumns = computed(() => [
    'select',
    ...this._brnColumnManager.displayedColumns(),
  ]);


  private readonly _customers = signal<Customer[]>([]);
  private readonly _filteredCustomers = computed(() => {
    const emailFilter = this._emailFilter()?.trim()?.toLowerCase();
    if (emailFilter && emailFilter.length > 0) {
      return this._customers().filter((u) => u.email.toLowerCase().includes(emailFilter));
    }
    return this._customers();
  });
  private readonly _emailSort = signal<'ASC' | 'DESC' | null>(null);
  protected readonly _filteredSortedPaginatedCustomers = computed(() => {
    const sort = this._emailSort();
    const start = this._displayedIndices().start;
    const end = this._displayedIndices().end + 1;
    const customers = this._filteredCustomers();
    if (!sort) {
      return customers.slice(start, end);
    }
    return [...customers]
      .sort((p1, p2) => (sort === 'ASC' ? 1 : -1) * p1.email.localeCompare(p2.email))
      .slice(start, end);
  });
  protected readonly _allFilteredPaginatedCustomersSelected = computed(() =>
    this._filteredSortedPaginatedCustomers().every((customer) => this._selected().includes(customer)),
  );
  protected readonly _checkboxState = computed(() => {
    const noneSelected = this._selected().length === 0;
    const allSelectedOrIndeterminate = this._allFilteredPaginatedCustomersSelected() ? true : 'indeterminate';
    return noneSelected ? false : allSelectedOrIndeterminate;
  });

  protected readonly _trackBy: TrackByFunction<Customer> = (_: number, p: Customer) => p.id;
  protected readonly _totalElements = computed(() => this._filteredCustomers().length);
  protected readonly _onStateChange = ({startIndex, endIndex}: PaginatorState) =>
    this._displayedIndices.set({start: startIndex, end: endIndex});

  protected toggleCustomer(customer: Customer) {
    this._selectionModel.toggle(customer);
  }

  protected handleHeaderCheckboxChange() {
    const previousCbState = this._checkboxState();
    if (previousCbState === 'indeterminate' || !previousCbState) {
      this._selectionModel.select(...this._filteredSortedPaginatedCustomers());
    } else {
      this._selectionModel.deselect(...this._filteredSortedPaginatedCustomers());
    }
  }

  protected handleEmailSortChange() {
    const sort = this._emailSort();
    if (sort === 'ASC') {
      this._emailSort.set('DESC');
    } else if (sort === 'DESC') {
      this._emailSort.set(null);
    } else {
      this._emailSort.set('ASC');
    }
  }


  private getAllCustomers() {
    this.customerService.getAll().subscribe({
      next: (customers) => {
        console.log('customers', customers);
        this._customers.set(customers);
      },
      error: (error) => {
        console.error('Error fetching customers', error);
      }
    });
  }

  deleteCustomer(customer: Customer) {
    this.customerService.delete(customer.id!).subscribe({
      next: () => {
        this._customers.set(this._customers().filter((c) => c.id !== customer.id));
        this._selectionModel.deselect(customer);
        toast.success('Customer has been deleted', {
          description : 'The customer has been deleted successfully.',
        })
      },
      error: (error) => {
        toast.error('Error deleting customer', {
          description : 'There was an error deleting the customer.',
        })
      }
    });
  }
}
