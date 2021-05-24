import Request from './request';
import { countryFromCode, countryCode } from './countriesCodes';

/**
 * A Class Library for handling Knawat MarketPlace related Operations.
 *
 * @class Vendors
 */
class Vendors extends Request {
  /**
   * Creates an instance of PurchaseOrders.
   * @param {...(key, secret) || token, apiRateLimit: { bucketSize, interval, limit } }
   */
  constructor(...args) {
    super(...args);
    this.vendorRequestPath = 'contacts';
  }

  
  /**
     * Get vendor by id
     *
     * @param {String} contact_id
     * @returns {Vendor}
     */
  getContactById(contact_id) {
    return this.request({
      path: `${this.vendorRequestPath}/${contact_id}`
    })
      .then(contact => {
        if (!contact) {
          throw new Error('Contact not found');
        }
        return this.transformVendorResult(contact.contact);
      })
      .catch(err => this.errorFactory(err));
  }
    
  /**
     * Create vendor
     *
     * @param {Object} ZohoVendor
     * @returns {Vendor}
     */
  createContact(vendor) {
    const body = this.transformRequest(vendor);
    const request = {
      path: this.vendorRequestPath,
      body,
      method: 'post',
    };
    return this.request(request)
      .then(contact => {
        if (!contact) {
          throw new Error('Contact not created');
        }
        return this.transformVendorResult(contact.contact);
      })
      .catch(err => this.errorFactory(err));
  }

  /**
     * Update vendor
     *
     * @param {Object} ZohoVendor
     * @returns {Vendor}
     */
  updateContact(contact_id, vendor){
    const body = this.transformRequest(vendor);
    const request = {
      path:`${this.vendorRequestPath}/${contact_id}`,
      body,
      method: 'put',
    };
    return this.request(request)
      .then(contact => {
        if (!contact) {
          throw new Error(Error.CONTACT_NOT_UPDATED);
        }
        return this.transformVendorResult(contact.contact);
      })
      .catch(err => this.errorFactory(err));
  }
  
  /**
     * Transform the vendor result entities
     *
     * @param {Array} entities
     */
  transformVendorResult(entities) {
    if (Array.isArray(entities)) {
      const vendors = entities
        .map(item => this.transformVendorResultEntity(item))
        .filter(vendor => vendor);
      return {
        vendors,
      };
    }

    const vendor = this.transformVendorResultEntity(entities);
    return { vendor };
  }

  /**
     * Transform a vendor result entity
     *
     * @param {Context} ctx
     * @param {Object} entity
     */
  transformVendorResultEntity(ZohoVendor) {
    if (!ZohoVendor) return false;
    const result = {
      id: ZohoVendor.contact_id,
      name: ZohoVendor.contact_name,
      users: ZohoVendor.contact_persons.map(user => ({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      })),
      companyName: ZohoVendor.company_name,
      billing: this.transformAddressResult(ZohoVendor.billing_address),
    };

    ZohoVendor.custom_fields.forEach(element => {
      const customFieldKey = element.label
        .split(' ')
        .map((val, key) => {
          let customVal = val.toLowerCase();
          if (key)
            customVal =
                customVal.charAt(0).toUpperCase() + customVal.slice(1);
          return customVal;
        })
        .join('');
      result[customFieldKey] = element.value;
    });
    return result;
  }

  /**
     * Transform a address entity
     *
     * @param {Context} ctx
     * @param {Object} entity
     */
  transformAddressResult(address) {
    return {
      address_1: address.address,
      address_2: address.street2,
      city: address.city,
      country: countryCode(address.country),
      first_name: address.attention
        ? address.attention.split(' ').slice(0, -1).join(' ')
        : '',
      last_name: address.attention
        ? address.attention.split(' ').slice(-1).join(' ')
        : '',
      phone: address.phone,
      postcode: address.zip,
      state: address.state,
    };
  }

  /**
     * Transform a vaendor request entity
     *
     * @param {Context} ctx
     * @param {Object} entity
     */
  transformRequest(entity) {
    const result = {
      contact_name: entity.name,
      company_name: entity.companyName,
      contact_persons: entity.users,
      billing_address:
          entity.billing && this.transformAddressRequest(entity.billing),
      custom_fields: [],
    };
    if (result.contact_persons) {
      const ownerUser =
          result.contact_persons[
            result.contact_persons.findIndex(user =>
              user.roles.includes('owner')
            )
          ];
      if (ownerUser) {
        ownerUser.primary = true;
      } else {
        result.contact_persons[0].primary = true;
      }
    }
    if (entity.bankInformation) {
      result.custom_fields.push({
        label: 'Bank Information',
        value: entity.bankInformation,
      });
    }

    if (entity.parentId) {
      result.custom_fields.push({
        label: 'Parent ID',
        value: entity.parentId,
      });
    }
    return result;
  }

  /**
     * Transform a address entity
     *
     * @param {Object} Address
     */
  transformAddressRequest(address) {
    return {
      address: address.address_1,
      attention: `${address.first_name} ${address.last_name}`,
      city: address.city || '',
      country: countryFromCode(address.country),
      phone: address.phone || '',
      state: address.state || '',
      street2: address.address_2 || '',
      zip: address.postcode || '',
    };
  }
}

module.exports = Vendors;
