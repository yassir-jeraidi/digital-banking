import {Customer} from './customer';
import {BankAccountStatus} from '@core/enums/bank-account-status';

export interface BankAccount {
  id ?: number;
  name : string;
  balance : number;
  currency : string;
  status : BankAccountStatus;
  customers : Customer[];
  updated_at : Date;
  created_at : Date;
}
