export interface ZohoBill {
  bill_id: string;
  bill_number: string;
  status: string;
  date: Date;
  due_date: Date;
  total: number;
  balance: number;
}
