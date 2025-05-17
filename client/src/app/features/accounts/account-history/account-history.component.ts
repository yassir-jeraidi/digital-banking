import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountHistory } from '@core/interfaces/account-history';
import { AccountOperation } from '@core/interfaces/account-operation';
import { AccountsService } from '@core/services/accounts.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { HlmToasterComponent } from '@spartan-ng/ui-sonner-helm';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-account-history',
  standalone: true,
  imports: [
    CommonModule,
    HlmButtonDirective,
    HlmCardModule,
    HlmLabelDirective,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    HlmToasterComponent,
  ],
  templateUrl: './account-history.component.html',
  styleUrls: ['./account-history.component.css'],
})
export class AccountHistoryComponent implements OnInit {
  accountId: string | null = null;
  customerId: number | null = null;
  accountHistory: AccountHistory | null = null;
  currentPage = 0;
  pageSize = 5;

  constructor(
    private accountsService: AccountsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    this.customerId = Number(this.route.snapshot.paramMap.get('customerId'));

    if (!this.accountId || !this.customerId) {
      this.router.navigate(['/customers']);
      return;
    }

    this.loadAccountHistory();
  }

  loadAccountHistory(): void {
    if (!this.accountId) return;

    this.accountsService
      .getAccountHistoryPaginated(
        this.accountId,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (history) => {
          this.accountHistory = history;
        },
        error: (err) => {
          toast.error(err.error?.message || 'Failed to load account history');
        },
      });
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadAccountHistory();
  }

  getOperationClass(type: string): string {
    return type === 'CREDIT' ? 'text-green-600' : 'text-red-600';
  }
}
