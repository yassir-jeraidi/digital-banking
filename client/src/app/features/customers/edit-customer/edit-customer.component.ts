import {Component, OnInit} from '@angular/core';
import {HlmButtonDirective} from "@spartan-ng/ui-button-helm";
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardHeaderDirective, HlmCardTitleDirective
} from "@spartan-ng/ui-card-helm";
import {HlmErrorDirective, HlmFormFieldComponent} from "@spartan-ng/ui-formfield-helm";
import {HlmIconDirective} from "@spartan-ng/ui-icon-helm";
import {HlmInputDirective} from "@spartan-ng/ui-input-helm";
import {NgIcon, provideIcons} from "@ng-icons/core";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Customer} from '@core/interfaces/customer';
import {CustomersService} from '@core/services/customers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {toast} from 'ngx-sonner';
import {lucidePencil} from '@ng-icons/lucide';

@Component({
  selector: 'app-edit-customer',
  imports: [
    HlmButtonDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmErrorDirective,
    HlmFormFieldComponent,
    HlmIconDirective,
    HlmInputDirective,
    NgIcon,
    NgIf,
    ReactiveFormsModule
  ],
  providers : [
    provideIcons({lucidePencil})
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent implements OnInit {

  customer: Customer = {} as Customer;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.getCustomer()
  }

  getCustomer() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.customersService.getById(+id).subscribe({
        next: (customer) => {
          this.customer = customer;
          this.form.patchValue({
            name: customer.name,
            email: customer.email
          });
        },
        error: () => {
          toast.error(
            'Error loading customer',
            {
              description: 'There was an error loading the customer.'
            }
          )
          this.router.navigateByUrl('/customers');
        }
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const {name, email} = this.form.value;
      this.customersService.update(this.customer.id!, {name, email} as Customer).subscribe({
        next: () => {
          this.router.navigateByUrl('/customers');
          toast.success(
            'Customer updated successfully',
            {
              description: 'The customer has been updated successfully.'
            }
          )
        },
        error: (error) => {
          toast.error(
            'Error updating customer',
            {
              description: 'There was an error updating the customer.'
            }
          )
        }
      });
    }
  }
}
