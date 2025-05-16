import {OperationType} from '@core/enums/operation-type';
import {BankAccount} from '@core/interfaces/bank-account';

export interface AccountOperation {
  id ?: number;
  operationDate : Date;
  amount : number;
  type : OperationType,
  bankAccount : BankAccount,
  description : string;
}
