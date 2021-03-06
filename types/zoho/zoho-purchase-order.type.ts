import { ZohoAddress } from './zoho-address.type';
import { ZohoBill } from './zoho-bill.type';
import { ZohoPurchaseOrderComment } from './zoho-purchase-order-comment.type';
import { ZohoItem } from './zoho-item.type';
import { ZohoPurchaseReceive } from './zoho-purchase-receive.type';
import { ZohoTax } from './zoho-tax.type';

export interface ZohoPurchaseOrder {
  purchaseorder_id: string;
  vendor_id: string;
  vendor_name: string;
  company_name: string;
  status: string;
  order_status: string;
  billed_status: string;
  received_status: string;
  color_code: string;
  current_sub_status_id: string;
  current_sub_status: string;
  purchaseorder_number: string;
  reference_number: string;
  date: Date;
  delivery_date: Date;
  currency_id: string;
  currency_code: string;
  price_precision: string;
  total: number;
  has_attachment: boolean;
  created_time: string;
  last_modified_time: Date;
  is_drop_shipment: boolean;
  total_ordered_quantity: number;
  quantity_yet_to_receive: number;
  quantity_manually_received: number;
  is_manually_received: boolean;
  is_backorder: boolean;
  client_viewed_time: string;
  is_viewed_by_client: boolean;
  cf_shipment_tracking_number: number;
  cf_fulfillment_center_id: string;
  cf_receive_status: string;
  custom_field_hash: any;
  comments: ZohoPurchaseOrderComment[];
  line_items: ZohoItem[];
  delivery_address: ZohoAddress[];
  expected_delivery_date: Date;
  currency_symbol: string;
  exchange_rate: number;
  is_inclusive_tax: boolean;
  salesorder_id: string;
  adjustment: number;
  adjustment_description: string;
  sub_total: number;
  discount_amount: number;
  sub_total_inclusive_of_tax: number;
  tax_total: number;
  taxes: ZohoTax[];
  notes: string;
  terms: string;
  ship_via: string;
  attention: string;
  delivery_org_address_id: string;
  delivery_customer_id: string;
  delivery_customer_name: string;
  purchasereceives: ZohoPurchaseReceive[];
  salesorders: unknown[];
  bills: ZohoBill[];
}
