import {BankAccount} from '@core/interfaces/bank-account';

export interface CurrentBankAccount extends BankAccount{
  overDraft : number;
}
