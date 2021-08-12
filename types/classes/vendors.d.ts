import { RateLimit, ResMessage } from '../common'
import { ZohoContact } from '../zoho';

export class Vendors {
  constructor(
    args?: RateLimit
  );
  getContactById(contact_id:string): Promise<{ vendor: ZohoContact }>;
  createContact(
    vendor: ZohoContact
  ): Promise<{ vendor: ZohoContact }>;
  updateContact(
    contact_id: string,
    vendor: ZohoContact
  ): Promise<{ vendor: ZohoContact }>;

  // Unthrottled Fetch
  _fetch<T>(...args: any): Promise<T | { errors: ResMessage[] }>;
  $fetch<T>(...args: any): Promise<T | { errors: ResMessage[] }>;
}
