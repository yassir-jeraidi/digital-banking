import { Routes } from '@angular/router';
import { CustomersComponent } from '@features/customers/customers.component';
import { NewCustomerComponent } from '@features/customers/new-customer/new-customer.component';

export const routes: Routes = [
  {
    path: 'customers',
    component: CustomersComponent
  },
  {
    path: 'customers/new',
    component: NewCustomerComponent
  }
];
