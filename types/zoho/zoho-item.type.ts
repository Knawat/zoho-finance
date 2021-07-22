export interface ZohoItem {
  item_id: string;
  sku: string;
  item_order?: number;
  rate: number;
  item_total: number;
  name: string;
  description: string;
  quantity: number;
  product_type?: 'goods' | 'services';
  fulfillment_center_id?: string;
  discount?: number;
  discount_amount?: number;
  tax_id?: string;
  unit?: 'kgs' | 'Nos' | 'pcs';
  upc?: string;
  item_type: 'sales' | 'purchases' | 'sales_and_purchases' | 'inventory';
  item_custom_field_hash?: { [key: string]: string };
  purchase_description: string;
  purchase_rate: number;
  vendor_id?: number;
  package_details: {
    height: number;
    length: number;
    weight: number;
    width: number;
  };
  account_id?: string;
  tax_name?: string;
  tax_type?: string;
  tax_percentage?: number;
  line_item_id: string;
  quantity_cancelled: number;
  quantity_received: number;
  salesorder_number?: string;
  salesorder_item_id?: string;
  project_id?: string;
  supplier_id?: string;
}
