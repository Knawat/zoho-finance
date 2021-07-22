import { RateLimit, ResMessage } from '../common'

import { ZohoResponse, ZohoPurchaseOrder, ZohoPurchaseOrderComment } from '../zoho';

export class PurchaseOrders {

  constructor(
    args?: RateLimit
  );

  getPurchaseOrders(...args: {
    vendor_id?: string;
    fulfillment_center_id?: string;
    purchaseorder_number?: string;
    page?: number;
    per_page?: number;
    status?:
      | 'draft'
      | 'issued'
      | 'received'
      | 'cancelled'
      | 'billed'
      | 'closed';
    receive_status?:
      | 'draft'
      | 'issued'
      | 'received'
      | 'cancelled'
      | 'billed'
      | 'closed';
  }[]): Promise<ZohoResponse<{ purchaseorders: ZohoPurchaseOrder[] }>>;

  getPurchaseOrderById(
    orderId: string,
    ...params: {
    vendor_id?: string;
    fulfillment_center_id?: string;
    include_comments?: boolean;
  }[]): Promise<ZohoResponse<{ purchaseorder: ZohoPurchaseOrder }>>;

  getComments(
    orderId: string,
    ...params: {
    vendor_id?: string;
    fulfillment_center_id?: string;
  }[]): Promise<{ comments: ZohoPurchaseOrderComment[] }>;

  createPurchaseOrder(
    vendor_id: string,
    fulfillment_center_id: string,
    ...body: {
      line_items: any;
  }[]): Promise<{ purchaseorder: ZohoPurchaseOrder }>;

  updatePurchaseOrder(
    orderId: string,
    vendor_id: string,
    ...body: {
      line_items?: any;
      ship_via?: string;
      custom_fields?: {
        label: string;
        value: string;
      }[];
  }[]): Promise<{ purchaseorder: ZohoPurchaseOrder }>;

  addOrderComment(
    orderId: string,
    vendor_id: string,
    ...body: {
      expectedDeliveryDate: Date;
      description: string;
  }[]): Promise<{ comment: ZohoPurchaseOrderComment }>;

  status(
    orderId: string,
    vendor_id: string,
    status: string
    ): Promise<{ message: string }>;

  createReceive(
    orderId: string,
    fulfillment_center_id: string,
    ...body: {
      date: string;
      line_items: {
        line_item_id: string;
        quantity: number;
      }[];
  }[]): Promise<{ message: string }>;

  validateOrder(
    orderId: string,
    vendor_id?: string,
    fulfillment_center_id?: string,
  ): Promise<{ purchaseorder: ZohoPurchaseOrder }>;

  // Unthrottled Fetch
  _fetch<T>(...args: any): Promise<T | { errors: ResMessage[] }>;
  $fetch<T>(...args: any): Promise<T | { errors: ResMessage[] }>;
}