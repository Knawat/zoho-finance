import { PurchaseOrder, PurchaseOrderComment, Address, RoleUser } from '@knawat/types';

// TODO: add in @knawat/types
export interface SPVendor {
  id?: string;
  name: string;
  users: Partial<RoleUser<'owner' | 'accounting' | 'products' | 'orders'>>[];
  billing?: Address;
  companyName: string;
  bankInformation?: string;
  parentId?: string;
  [key: string]: unknown;
}

interface RateLimit {
  apiRateLimit?: Partial<{
    reservoir: number;
    reservoirRefreshInterval: number;
    reservoirRefreshAmount: number;
    maxConcurrent: number;
  }>;
}

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
  }[]): Promise<{ orders: PurchaseOrder[] }>;
  getPurchaseOrderById(
    orderId: string,
    ...params: {
    vendor_id?: string;
    fulfillment_center_id?: string;
    include_comments?: boolean;
  }[]): Promise<{ order: PurchaseOrder }>;
  getComments(
    orderId: string,
    ...params: {
    vendor_id?: string;
    fulfillment_center_id?: string;
  }[]): Promise<{ comments: PurchaseOrderComment[] }>;
  createPurchaseOrder(
    vendor_id: string,
    fulfillment_center_id: string,
    ...body: {
      line_items: any;
  }[]): Promise<{ order: PurchaseOrder }>;
  updatePurchaseOrder(
    orderId: string,
    ...body: {
      line_items: any;
  }[]): Promise<{ order: PurchaseOrder }>;
  addOrderComment(
    orderId: string,
    vendor_id: string,
    ...body: {
      expectedDeliveryDate: Date;
      description: string;
  }[]): Promise<{ comment: PurchaseOrderComment }>;
  setPoTrackingNumber(
    orderId: string,
    vendor_id: string,
    ...body: {
      shipmentTrackingNumber: string;
      shipVia: string;
  }[]): Promise<{ order: PurchaseOrder }>;
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
  ): Promise<{ order: PurchaseOrder }>;

  // Unthrottled Fetch
  _fetch<T>(...args: any): Promise<T | { errors: ResMessage[] }>;
  $fetch<T>(...args: any): Promise<T | { errors: ResMessage[] }>;
}


export class Vendors {
  constructor(
    args?: RateLimit
  );
  getContactById(contact_id:string): Promise<{ vendor: SPVendor }>;
  createContact(
    vendor: SPVendor
  ): Promise<{ vendor: SPVendor }>;
  updateContact(
    contact_id: string,
    vendor: SPVendor
  ): Promise<{ vendor: SPVendor }>;

  // Unthrottled Fetch
  _fetch<T>(...args: any): Promise<T | { errors: ResMessage[] }>;
  $fetch<T>(...args: any): Promise<T | { errors: ResMessage[] }>;
}

interface ResMessage {
  message: string;
}
