import { Address, RoleUser } from '@knawat/types';
import { RateLimit, ResMessage } from '../common'

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
