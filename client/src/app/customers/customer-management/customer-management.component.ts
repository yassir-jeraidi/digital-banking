import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css'],
})
export class CustomerManagementComponent implements OnInit {
  // Customer data
  customers: any[] = [];
  totalCustomers = 0;
  currentPage = 0;
  pageSize = 10;
  sortBy = 'id';
  sortDirection = 'ASC';
  searchQuery = '';

  // UI state
  isLoading = false;
  error: string | null = null;
  selectedCustomer: any = null;
  isEditMode = false;
  showCustomerForm = false;

  // Forms
  customerForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')],
      ],
      address: ['', Validators.maxLength(200)],
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    let url = `${environment.apiUrl}/customers?page=${this.currentPage}&size=${this.pageSize}&sortBy=${this.sortBy}&direction=${this.sortDirection}`;

    if (this.searchQuery) {
      url = `${environment.apiUrl}/customers/search?query=${this.searchQuery}&page=${this.currentPage}&size=${this.pageSize}`;
    }

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.customers = data.content;
        this.totalCustomers = data.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading customers', err);
        this.error = 'Failed to load customers. Please try again.';
        this.isLoading = false;
      },
    });
  }

  onSearch(): void {
    this.currentPage = 0; // Reset to first page when searching
    this.loadCustomers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCustomers();
  }

  onSortChange(column: string): void {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = column;
      this.sortDirection = 'ASC';
    }
    this.loadCustomers();
  }

  openCustomerForm(customer?: any): void {
    if (customer) {
      this.isEditMode = true;
      this.selectedCustomer = customer;
      this.customerForm.patchValue({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        address: customer.address,
      });
    } else {
      this.isEditMode = false;
      this.selectedCustomer = null;
      this.customerForm.reset();
    }
    this.showCustomerForm = true;
  }

  closeCustomerForm(): void {
    this.showCustomerForm = false;
    this.customerForm.reset();
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const customerData = this.customerForm.value;
    this.isLoading = true;

    if (this.isEditMode && this.selectedCustomer) {
      // Update existing customer
      this.http
        .put(
          `${environment.apiUrl}/customers/${this.selectedCustomer.id}`,
          customerData
        )
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.closeCustomerForm();
            this.loadCustomers();
          },
          error: (err) => {
            console.error('Error updating customer', err);
            this.error = 'Failed to update customer. Please try again.';
            this.isLoading = false;
          },
        });
    } else {
      // Create new customer
      this.http
        .post(`${environment.apiUrl}/customers`, customerData)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.closeCustomerForm();
            this.loadCustomers();
          },
          error: (err) => {
            console.error('Error creating customer', err);
            this.error = 'Failed to create customer. Please try again.';
            this.isLoading = false;
          },
        });
    }
  }

  deleteCustomer(customer: any): void {
    if (
      confirm(
        `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`
      )
    ) {
      this.isLoading = true;
      this.http
        .delete(`${environment.apiUrl}/customers/${customer.id}`)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.loadCustomers();
          },
          error: (err) => {
            console.error('Error deleting customer', err);
            this.error = 'Failed to delete customer. Please try again.';
            this.isLoading = false;
          },
        });
    }
  }

  // Helper method to get form control error messages
  getErrorMessage(controlName: string): string {
    const control = this.customerForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid format';
    }
    return '';
  }
}
