// src/app/features/accounts/accounts.component.ts
import { Component, OnInit, signal } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { BankAccount } from '@core/interfaces/bank-account';
import { AccountsService } from '@core/services/accounts.service';
import { NgIcon } from '@ng-icons/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { HlmMenuComponent, HlmMenuItemImports, HlmMenuStructureImports } from '@spartan-ng/ui-menu-helm';
import {HlmIconDirective} from '@spartan-ng/ui-icon-helm';
import {SavingBankAccount} from '@core/interfaces/saving-bank-account';
import {CurrentBankAccount} from '@core/interfaces/current-bank-account';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    NgIcon,
    HlmButtonDirective,
    HlmCardModule,
    HlmLabelDirective,
    CurrencyPipe,
    DatePipe,
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    HlmMenuItemImports,
    HlmMenuStructureImports,
    RouterLink,
    HlmIconDirective
  ],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  protected readonly account = signal<SavingBankAccount | CurrentBankAccount | null>(null);
  private accountId: string | null = null;
  private customerId: number | null = null;

  constructor(
    private accountsService: AccountsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('customerId'));
    this.accountId = this.route.snapshot.paramMap.get('accountId');

    if (this.accountId) {
      this.getAccount();
    } else {
      console.error('No account ID provided');
      // this.router.navigate([`/customers/${this.customerId}`]);
    }
  }

  protected deleteAccount() {
    const account = this.account();
    if (account?.id) {
      this.accountsService.delete(account.id).subscribe({
        next: () => {
          this.router.navigate([`/customers/${this.customerId}`]);
        },
        error: (error) => {
          console.error('Error deleting account:', error);
          alert('Failed to delete account');
        }
      });
    }
  }

  private getAccount() {
    if (this.accountId) {
      this.accountsService.getById(this.accountId).subscribe({
        next: (account) => {
          this.account.set(account);
        },
        error: (error) => {
          console.error('Error fetching account:', error);
          // this.router.navigate([`/customers/${this.customerId}`]);
        }
      });
    }
  }
}
