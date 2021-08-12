import Request from './request';
import { countryCode } from './countriesCodes';

/**
 * A Class Library for handling Knawat MarketPlace related Operations.
 *
 * @class PurchaseOrders
 */
class PurchaseOrders extends Request {
  /**
   * Creates an instance of PurchaseOrders.
   * @param {...(key, secret) || token, apiRateLimit: { bucketSize, interval, limit } }
   */
  constructor(...args) {
    super(...args);
    this.poRequestPath = 'purchaseorders';
  }

  /**
   * Get all imported products
   *
   * @param {object} {
   *     vendor_id = string
   *     fulfillment_center_id = string
   *     page = number
   *     per_page = number
   *     status = open | draft | issued | cancelled | billed | closed
   *   }
   * @memberof PurchaseOrders
   */
  getPurchaseOrders(params = {}) {
    const request = {
      path: this.poRequestPath,
      params
    };
    return this.request(request);
  }

  /**
   * Get order details by id
   *
   * @param {String} orderId
   * @param {String} vendor_id
   * @returns {Order}
   */
  getPurchaseOrderById(orderId, params = {}){
    const { vendor_id, fulfillment_center_id } = params;
    const request = {
      path: `${this.poRequestPath}/${orderId}`,
      params
    };
    return this.request(request)
      .then(order => {
        if (!order) {
          throw new Error('This order not found');
        }
        if (vendor_id && order.purchaseorder.vendor_id !== vendor_id) {
          throw new Error('This order is not related to this vendor');
        }
        if (
          fulfillment_center_id &&
            order.purchaseorder.custom_field_hash
              ?.cf_fulfillment_center_id !== fulfillment_center_id
        ) {
          throw new Error('This order not related to this fulfillment center');
        }
        return order;
      })
      .then(
        async order => {
          if (params.include_comments) {
            // Get comments for order
            const comments = await this.getComments(orderId, {
              vendor_id,
              fulfillment_center_id,
            })
              .then(res => res.comments || []);
            order.purchaseorder.comments = comments;
          }
          return order;
        }
      )
      .catch(err => this.errorFactory(err));
  }

  /**
   * Get comments by orderId
   *
   * @param {String} orderId
   * @param {String} vendor_id
   * @returns {Order}
   */
  getComments(orderId) {
    const request = { path:  `${this.poRequestPath}/${orderId}/comments` };
    return this.request(request).catch(err => this.errorFactory(err));
  }

  /**
   * Create purchase order
   *
   * @param {PurchaseOrderItem[]} line_items
   * @returns {Order}
   */
  createPurchaseOrder(vendor_id, fulfillment_center_id, body) {
    const { line_items } = body;
    const request = {
      path: this.poRequestPath,
      method: 'POST',
      body: this.transformRequest({
        vendor_id,
        line_items,
        fulfillment_center_id,
      }),
    };
    return this.request(request)
      .catch(err =>
        this.errorFactory(err)
      );
  }

  /**
   * Update purchase order
   *
   * @param {String} orderId
   * @param {PurchaseOrderItem[]} line_items
   * @returns {Order}
   */
  updatePurchaseOrder(orderId, vendor_id, body) {
    const request = {
      path: `${this.poRequestPath}/${orderId}`,
      method: 'PUT',
      body: this.transformRequest(body),
    };
    return this.validateOrder(orderId, vendor_id)
      .then(() => this.request(request))
      .catch(err =>
        this.errorFactory(err)
      );
  }

  /**
   * Add comment on order
   *
   * @param {String} orderId
   * @param {String} vendor_id
   * @param {String} expectedDeliveryDate
   * @param {String} description
   * @returns {Order}
   */
  addOrderComment(orderId, vendor_id, body) {
    const { expectedDeliveryDate, description } = body;
    const request = {
      path: `${this.poRequestPath}/${orderId}/comments`,
      method: 'POST',
      body: {
        description,
        expected_delivery_date: expectedDeliveryDate,
      },
    };
    return this.validateOrder(orderId, vendor_id)
      .then(() => this.request(request))
      .catch(err =>
        this.errorFactory(err)
      );
  }

  /**
   * Set tracking number on purchase order
   *
   * @param {String} orderId
   * @param {String} vendor
   * @param {String} shipmentTrackingNumber
   * @param {String} shipVia
   * @returns {Order}
   */
  setPoTrackingNumber(orderId, vendor_id, body) {
    const { shipmentTrackingNumber, shipVia } = body;
    const request = {
      path: `${this.poRequestPath}/${orderId}`,
      method: 'PUT',
      body: {
        custom_fields: [
          {
            label: 'Shipment Tracking Number',
            value: shipmentTrackingNumber,
          },
          {
            label: 'Receive Status',
            value: 'shipped',
          },
        ],
        ship_via: shipVia,
      },
    };
    return this.validateOrder(orderId, vendor_id)
      .then(() => this.request(request))
      .catch(err =>
        this.errorFactory(err)
      );
  }

  /**
   * Cancel order
   *
   * @param {String} orderId
   * @param {String} vendor_id
   * @returns {Orders}
   */
  status(orderId, vendor_id, status) {
    const request = {
      path: `${this.poRequestPath}/${orderId}/status/${status}`,
      method: 'POST',
    };
    return this.validateOrder(orderId, vendor_id)
      .then(() => this.request(request))
      .catch(err =>
        this.errorFactory(err)
      );
  }

  /**
   * Create purchase order receive to mark order as received
   *
   * @param {String} orderId
   * @param {String} vendor_id
   * @param {String} date - Purchase order received date : yyyy-mm-dd
   * @returns {Orders}
   */
  createReceive(orderId, fulfillment_center_id, body)  {
    const request = {
      path: 'purchasereceives',
      params: { purchaseorder_id: orderId },
      body,
      method: 'POST',
    };
    return this.validateOrder(orderId, '', fulfillment_center_id)
      .then(() => this.request(request)
        .then(res => ({
          message: res.message,
        })))
      .catch(err =>
        this.errorFactory(err)
      );
  }

  /**
   * Check if order exists
   */
  async validateOrder(orderId, vendor_id, fulfillment_center_id ) {
    if (!orderId) {
      throw new Error('Order id is required', 404);
    }
    return this.getPurchaseOrderById(orderId, {
      vendor_id,
      fulfillment_center_id
    });
  }

  /**
   * Get custom field value by key
   *
   * @param {(GenericObject | undefined)} customFields
   * @param {string} key
   * @returns {string}
   */
  getCustomField(customFields, key) {
    if (!customFields) {
      return '';
    }

    return customFields[`cf_${key.toLocaleLowerCase().replace(/ /g, '_')}`];
  }

  /**
   * Transform PO body to zoho form
   *
   * @private
   * @static
   * @param {ZohoItem} lineItems
   */
  transformRequest(body) {
    const orderBody = {
      ...body,
      custom_fields: body.custom_fields || [],
    };
    if(body.fulfillment_center_id){
      orderBody.custom_fields.push({
        label: 'Fulfillment Center Id',
        value: body.fulfillment_center_id,
      });
    }
    
    if(body.line_items && body.line_items.length){
      orderBody.line_items = body.line_items.map(li => ({
        salesorder_item_id: li.salesorderItemId,
        name: li.name,
        item_id: li.id,
        quantity: li.quantity,
        rate: li.rate,
        description: li.description,
        tax_id: li.taxId,
      }));
    }
    return orderBody;
  }
}

module.exports = PurchaseOrders;
