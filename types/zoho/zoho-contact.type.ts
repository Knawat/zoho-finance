
import { ZohoAddress } from './zoho-address.type';

export interface RoleUser<T> {
  email: string;
  first_name?: string;
  last_name?: string;
  roles: T[];
}

export interface ZohoContact {
  contact_id?: string;
  contact_name: string;
  contact_persons: Partial<RoleUser<'owner' | 'accounting' | 'products' | 'orders'>>[];
  billing_address?: ZohoAddress;
  company_name: string;
  [key: string]: unknown;
}