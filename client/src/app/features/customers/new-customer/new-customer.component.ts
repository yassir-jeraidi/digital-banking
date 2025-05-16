import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HlmButtonModule} from '@spartan-ng/ui-button-helm';
import {HlmFormFieldModule} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmSelectModule} from '@spartan-ng/ui-select-helm';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {HlmIconDirective} from '@spartan-ng/ui-icon-helm';
import {
  lucidePlus,
} from '@ng-icons/lucide';
import {HlmCardImports} from '@spartan-ng/ui-card-helm';
import {NgIf} from '@angular/common';
import {CustomersService} from '@core/services/customers.service';
import {Router} from '@angular/router';
import {Customer} from '@core/interfaces/customer';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-new-customer',
  imports: [
    ReactiveFormsModule,
    HlmFormFieldModule,
    HlmSelectModule,
    HlmInputDirective,
    HlmIconDirective,
    HlmButtonModule,
    NgIcon,
    HlmCardImports,
    NgIf,
  ],
  providers: [
    provideIcons({lucidePlus})
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.css'
})
export class NewCustomerComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const {name, email} = this.form.value;
      this.customersService.create({name, email} as Customer).subscribe({
        next: () => {
          this.router.navigateByUrl('/customers');
          toast.success(
            'Customer created successfully',
            {
              description: 'The customer has been created successfully.'
            }
          )
        },
        error: (error) => {
          toast.error(
            'Error creating customer',
            {
              description: 'There was an error creating the customer.'
            }
          )
        }
      });
    }
  }
}
