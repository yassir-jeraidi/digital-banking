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
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-account-operations',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HlmButtonDirective,
    HlmCardModule,
    HlmInputDirective,
    HlmLabelDirective,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './account-operations.component.html',
  styleUrls: ['./account-operations.component.css'],
})
export class AccountOperationsComponent implements OnInit {
  operationForm!: FormGroup;
  accountId: string | null = null;
  operationType: 'DEBIT' | 'CREDIT' = 'DEBIT';

  constructor(
    private fb: FormBuilder,
    private accountsService: AccountsService,
    protected route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('accountId');

    if (!this.accountId) {
      this.router.navigate(['/customers']);
      return;
    }

    this.initForm();
  }

  initForm(): void {
    this.operationForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
    });
  }

  setOperationType(type: 'DEBIT' | 'CREDIT'): void {
    this.operationType = type;
  }

  submitOperation(): void {
    if (this.operationForm.invalid || !this.accountId) {
      return;
    }

    const { amount, description } = this.operationForm.value;

    const operation =
      this.operationType === 'DEBIT'
        ? this.accountsService.debit(this.accountId, amount, description)
        : this.accountsService.credit(this.accountId, amount, description);

    operation.subscribe({
      next: () => {
        toast.success(
          `${this.operationType.toLowerCase()} operation successful`
        );
        this.operationForm.reset();
        setTimeout(() => {
          this.router.navigate([
            `/customers/${this.route.snapshot.paramMap.get(
              'customerId'
            )}/accounts/${this.accountId}`,
          ]);
        }, 1500);
      },
      error: (err) => {
        toast.error(
          err.error?.message ||
            `Failed to perform ${this.operationType.toLowerCase()} operation`
        );
      },
    });
  }
}
