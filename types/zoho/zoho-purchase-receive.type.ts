import { ZohoBill } from './zoho-bill.type';

export interface ZohoPurchaseReceive {
  receive_id: string;
  receive_number: string;
  date: Date;
  notes: string;
  bills: ZohoBill[];
}
