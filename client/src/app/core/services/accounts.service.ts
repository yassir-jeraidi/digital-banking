import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankAccount } from '@core/interfaces/bank-account';
import { Observable } from 'rxjs';
import { SavingBankAccount } from '@core/interfaces/saving-bank-account';
import { CurrentBankAccount } from '@core/interfaces/current-bank-account';
import { AccountOperation } from '@core/interfaces/account-operation';
import { AccountHistory } from '@core/interfaces/account-history';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<(SavingBankAccount | CurrentBankAccount)[]> {
    return this.http.get<(SavingBankAccount | CurrentBankAccount)[]>(
      'accounts'
    );
  }

  getById(id: string): Observable<SavingBankAccount | CurrentBankAccount> {
    return this.http.get<SavingBankAccount | CurrentBankAccount>(
      `accounts/${id}`
    );
  }

  create(account: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>('accounts', account);
  }

  update(id: number, account: BankAccount): Observable<BankAccount> {
    return this.http.put<BankAccount>(`accounts/${account.id}`, account);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`accounts/${id}`);
  }

  // Get account operations history
  getAccountHistory(accountId: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(
      `accounts/${accountId}/operations`
    );
  }

  // Get paginated account operations history
  getAccountHistoryPaginated(
    accountId: string,
    page: number = 0,
    size: number = 5
  ): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(
      `accounts/${accountId}/pageOperations?page=${page}&size=${size}`
    );
  }

  // Debit operation
  debit(
    accountId: string,
    amount: number,
    description: string
  ): Observable<any> {
    return this.http.post<any>('accounts/debit', {
      accountId,
      amount,
      description,
    });
  }

  // Credit operation
  credit(
    accountId: string,
    amount: number,
    description: string
  ): Observable<any> {
    return this.http.post<any>('accounts/credit', {
      accountId,
      amount,
      description,
    });
  }

  // Create new account
  createSavingAccount(
    initialBalance: number,
    interestRate: number,
    customerId: number
  ): Observable<SavingBankAccount> {
    return this.http.post<SavingBankAccount>('accounts/saving', {
      initialBalance,
      interestRate,
      customerId,
    });
  }

  createCurrentAccount(
    initialBalance: number,
    overDraft: number,
    customerId: number
  ): Observable<CurrentBankAccount> {
    return this.http.post<CurrentBankAccount>('accounts/current', {
      initialBalance,
      overDraft,
      customerId,
    });
  }
}
