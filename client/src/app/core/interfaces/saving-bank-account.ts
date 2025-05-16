import {BankAccount} from '@core/interfaces/bank-account';

export interface SavingBankAccount extends BankAccount{
  interestRate : number;
}
