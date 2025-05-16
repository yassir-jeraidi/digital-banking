import {BankAccount} from '@core/interfaces/bank-account';

export interface Customer {
  id ?: number;
  name : string;
  email : string;
  banksAccounts : BankAccount[];
}
