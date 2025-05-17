import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountsService } from '@core/services/accounts.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CurrentBankAccount } from '@core/interfaces/current-bank-account';
import { SavingBankAccount } from '@core/interfaces/saving-bank-account';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonDirective,
    HlmCardModule,
    HlmInputDirective,
    HlmLabelDirective,
    CommonModule,
    RouterLink,
    HlmToasterComponent,
  ],
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
})
export class NewAccountComponent implements OnInit {
  accountForm!: FormGroup;
  customerId: number | null = null;
  accountType: 'CURRENT' | 'SAVING' = 'CURRENT';

  constructor(
    private fb: FormBuilder,
    private accountsService: AccountsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('customerId'));

    if (!this.customerId) {
      this.router.navigate(['/customers']);
      return;
    }

    this.initForm();
  }

  initForm(): void {
    this.accountForm = this.fb.group({
      initialBalance: ['', [Validators.required, Validators.min(0)]],
      // This field will be either overDraft or interestRate based on account type
      specificValue: ['', [Validators.required, Validators.min(0)]],
    });
  }

  setAccountType(type: 'CURRENT' | 'SAVING'): void {
    this.accountType = type;
  }

  submitForm(): void {
    if (this.accountForm.invalid || !this.customerId) {
      return;
    }

    const { initialBalance, specificValue } = this.accountForm.value;

    const createAccount: Observable<CurrentBankAccount | SavingBankAccount> =
      this.accountType === 'CURRENT'
        ? this.accountsService.createCurrentAccount(
            initialBalance,
            specificValue,
            this.customerId
          )
        : this.accountsService.createSavingAccount(
            initialBalance,
            specificValue,
            this.customerId
          );

    createAccount.subscribe({
      next: (account) => {
        toast.success(
          `${this.accountType.toLowerCase()} account created successfully`
        );
        this.accountForm.reset();
        setTimeout(() => {
          this.router.navigateByUrl('/customers');
        }, 1500);
      },
      error: (err) => {
        toast.error(
          err.error?.message ||
            `Failed to create ${this.accountType.toLowerCase()} account`
        );
      },
    });
  }
}
