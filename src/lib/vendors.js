import Request from './request';

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
        return contact.contact;
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
    const request = {
      path: this.vendorRequestPath,
      body: vendor,
      method: 'post',
    };
    return this.request(request)
      .then(contact => {
        if (!contact) {
          throw new Error('Contact not created');
        }
        return contact.contact;
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
    const request = {
      path:`${this.vendorRequestPath}/${contact_id}`,
      body: vendor,
      method: 'put',
    };
    return this.request(request)
      .then(contact => {
        if (!contact) {
          throw new Error(Error.CONTACT_NOT_UPDATED);
        }
        return contact.contact;
      })
      .catch(err => this.errorFactory(err));
  }
}

module.exports = Vendors;
