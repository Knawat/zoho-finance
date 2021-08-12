import { ZohoItem } from './zoho-item.type';

export interface ZohoSalesOrder {
  salesorder_number: string;
  line_items: ZohoItem[];
}
