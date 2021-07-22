export interface ZohoPurchaseOrderComment {
  comment_id: string;
  purchaseorder_id: string;
  comment_type: string;
  date: Date;
  date_description: string;
  time: string;
  operation_type: string;
  transaction_type: string;
  description: string;
}
