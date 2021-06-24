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
    this.validateParams(params);
    const request = {
      path: this.poRequestPath,
      params
    };
    return this.request(request)
      .then(order =>
        this.transformResult(order.purchaseorders).then(
          (orders) => {
            orders.has_more_page =
            order.page_context && order.page_context.has_more_page
              ? order.page_context.has_more_page
              : false;
            return orders;
          }
        )
      );
  }

  /**
   * Get order details by id
   *
   * @param {String} orderId
   * @param {String} vendor_id
   * @returns {Order}
   */
  getPurchaseOrderById(orderId, params = {}){
    this.validateParams(params);
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
      .then(order => this.transformResult(order.purchaseorder))
      .catch(err => this.errorFactory(err));
  }

  /**
   * Get comments by orderId
   *
   * @param {String} orderId
   * @param {String} vendor_id
   * @returns {Order}
   */
  getComments(orderId, params = {}) {
    this.validateParams(params);
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
      .then(res => this.transformResult(res.purchaseorder))
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
  updatePurchaseOrder(orderId, body) {
    const { line_items } = body;
    const request = {
      path: `${this.poRequestPath}/${orderId}`,
      method: 'PUT',
      body: this.transformRequest({
        line_items,
      }),
    };
    return this.request(request)
      .then(res => this.transformResult(res.purchaseorder))
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
      .then(res => ({ comment: this.transformComment(res.comment) }))
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
      .then(order => this.transformResult(order.purchaseorder))
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
   * Delete order
   *
   * @param {String} orderId
   * @param {String} vendor_id
   * @returns {Orders}
   */
  delete(orderId, vendor_id) {
    const request = {
      path: `${this.poRequestPath}/${orderId}`,
      method: 'DELETE',
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
   * Transform the result entities
   *
   * @param {Context} ctx
   * @param {Array} entities
   */
  transformResult(entities) {
    if (Array.isArray(entities)) {
      return Promise.all(
        entities.map(async item => this.transformEntity(item))
      ).then(orders => ({ orders }));
    }
    return this.transformEntity(entities).then((order) => ({
      order,
    }));
  }

  /**
   * Transform a result entity
   *
   * @param {Object} entity
   */
  transformEntity(zohoPurchaseOrder) {
    if (!zohoPurchaseOrder) return Promise.resolve({});
    const purchaseOrder = {
      purchaseorderId: zohoPurchaseOrder.purchaseorder_id,
      purchaseorderNumber: zohoPurchaseOrder.purchaseorder_number,
      date: zohoPurchaseOrder.date,
      expectedDeliveryDate: zohoPurchaseOrder.expected_delivery_date,
      referenceNumber: zohoPurchaseOrder.reference_number,
      orderStatus: zohoPurchaseOrder.order_status,
      receivedStatus: zohoPurchaseOrder.received_status,
      receiveStatus: 
      zohoPurchaseOrder.cf_receive_status ||
      this.getCustomField(
        zohoPurchaseOrder.custom_field_hash,
        'Receive Status'
      ),
      billedStatus: zohoPurchaseOrder.billed_status,
      currencyCode: zohoPurchaseOrder.currency_code,
      currencySymbol: zohoPurchaseOrder.currency_symbol,
      exchangeRate: zohoPurchaseOrder.exchange_rate,
      deliveryDate: zohoPurchaseOrder.delivery_date,
      isDropShipment: zohoPurchaseOrder.is_drop_shipment,
      isInclusiveTax: zohoPurchaseOrder.is_inclusive_tax,
      salesorderId: zohoPurchaseOrder.salesorder_id,
      items:
        zohoPurchaseOrder.line_items &&
        zohoPurchaseOrder.line_items.map(item => this.transformItem(item)),
      adjustment: zohoPurchaseOrder.adjustment,
      adjustmentDescription: zohoPurchaseOrder.adjustment_description,
      subTotal: zohoPurchaseOrder.sub_total,
      discountTotal: zohoPurchaseOrder.discount_amount,
      subTotalInclusiveOfTax: zohoPurchaseOrder.sub_total_inclusive_of_tax,
      taxTotal: zohoPurchaseOrder.tax_total,
      total: zohoPurchaseOrder.total,
      taxes:
        zohoPurchaseOrder.taxes &&
        zohoPurchaseOrder.taxes.map(tax => this.transformTax(tax)),
      notes: zohoPurchaseOrder.notes,
      terms: zohoPurchaseOrder.terms,
      shipVia: zohoPurchaseOrder.ship_via,
      attention: zohoPurchaseOrder.attention,
      deliveryOrgAddressId: zohoPurchaseOrder.delivery_org_address_id,
      deliveryCustomerId: zohoPurchaseOrder.delivery_customer_id,
      deliveryCustomerName: zohoPurchaseOrder.delivery_customer_name,
      shipping:
        zohoPurchaseOrder.delivery_address &&
        this.transformAddress(
          zohoPurchaseOrder.delivery_address,
          zohoPurchaseOrder.attention
        ),
      createdTime: zohoPurchaseOrder.created_time,
      lastModifiedTime: zohoPurchaseOrder.last_modified_time,
      purchasereceives:
        zohoPurchaseOrder.purchasereceives &&
        zohoPurchaseOrder.purchasereceives.map(purchasereceive =>
          this.transformPurchaseReceive(purchasereceive)
        ),
      salesorders: [],
      bills:
        zohoPurchaseOrder.bills &&
        zohoPurchaseOrder.bills.map(bill => this.transformBill(bill)),
      shipmentTrackingNumber:
        zohoPurchaseOrder.cf_shipment_tracking_number ||
        this.getCustomField(
          zohoPurchaseOrder.custom_field_hash,
          'Shipment Tracking Number'
        ),
      fulfillmentCenterId:
        zohoPurchaseOrder.cf_fulfillment_center_id ||
        this.getCustomField(
          zohoPurchaseOrder.custom_field_hash,
          'Fulfillment Center Id'
        ),
      po_status: zohoPurchaseOrder.status,
    };
    // Any status before sent should be reserved
    if (
      ['draft', 'to approve', 'approved'].indexOf(purchaseOrder.po_status) !==
      -1
    ) {
      purchaseOrder.po_status = 'reserved';
    }

    if (zohoPurchaseOrder.comments) {
      purchaseOrder.comments =
        zohoPurchaseOrder.comments &&
        zohoPurchaseOrder.comments.map(comment =>
          this.transformComment(comment)
        );
    }
    return Promise.resolve(purchaseOrder);
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
   * Transform line items from zoho
   *
   * @private
   * @static
   * @param {ZohoItem} lineItems
   */
  transformItem(lineItem) {
    const orderItem = {
      description: lineItem.description,
      discount: lineItem.discount,
      discountAmount: lineItem.discount_amount,
      lineItemId: lineItem.line_item_id,
      id: lineItem.item_id,
      name: lineItem.name,
      quantity: lineItem.quantity,
      quantityCancelled: lineItem.quantity_cancelled,
      quantityReceived: lineItem.quantity_received,
      rate: lineItem.rate,
      sku: lineItem.sku,
      total: lineItem.item_total,
      accountId: lineItem.account_id,
      taxId: lineItem.tax_id,
      taxName: lineItem.tax_name,
      taxType: lineItem.tax_type,
      taxPercentage: lineItem.tax_percentage,
    };
    return orderItem;
  }

  /**
   * Transform comment from zoho
   *
   * @private
   * @static
   * @param {ZohoPurchaseOrderComment} comment
   */
  transformComment(comment) {
    const orderComment = {
      commentId: comment.comment_id,
      commentType: comment.comment_type,
      date: comment.date,
      dateDescription: comment.date_description,
      time: comment.time,
      operationType: comment.operation_type,
      transactionType: comment.transaction_type,
      description: comment.description,
    };
    return orderComment;
  }

  /**
   * Transform tax from zoho
   *
   * @private
   * @static
   * @param {ZohoTax} tax
   */
  transformTax(tax) {
    const orderTax = {
      id: tax.tax_id,
      name: tax.tax_name,
      amount: tax.tax_amount,
      percentage: tax.tax_percentage,
      type: tax.tax_type,
      isEditable: tax.is_editable,
    };
    return orderTax;
  }

  /**
   * Transform address from zoho
   *
   * @private
   * @static
   * @param {ZohoAddress} address
   * @param {string} attention
   */
  transformAddress(address, attention = '') {
    const orderAddress = {
      address_1: address.address,
      address_2: address.street2,
      city: address.city,
      country: countryCode(address.country),
      email: address.email,
      first_name: attention
        ? attention.split(' ').slice(0, -1).join(' ')
        : '',
      last_name: attention ? attention.split(' ').slice(-1).join(' ') : '',
      phone: address.phone,
      postcode: address.zip,
      state: address.state,
    };
    return orderAddress;
  }

  /**
   * Transform purchase receive from zoho
   *
   * @private
   * @static
   * @param {ZohoPurchaseReceive} purchasereceive
   */
  transformPurchaseReceive(purchasereceive) {
    const orderPurchaseReceive = {
      receiveId: purchasereceive.receive_id,
      receiveNumber: purchasereceive.receive_number,
      date: purchasereceive.date,
      notes: purchasereceive.notes,
      bills:
        purchasereceive.bills &&
        purchasereceive.bills.map(bill => this.transformBill(bill)),
    };
    return orderPurchaseReceive;
  }

  /**
   * Transform bill from zoho
   *
   * @private
   * @static
   * @param {ZohoBill} bill
   */
  transformBill(bill) {
    const orderBill = {
      billId: bill.bill_id,
      billNumber: bill.bill_number,
      status: bill.status,
      date: bill.date,
      dueDate: bill.due_date,
      total: bill.total,
      balance: bill.balance,
    };
    return orderBill;
  }

  /**
   * Check if vendor_id or fulfillment_center_id exists
   */
  validateParams(params) {
    const { vendor_id, fulfillment_center_id } = params;
    if (
      !vendor_id &&
      !fulfillment_center_id
    ) {
      throw new Error('Vendor or Fulfillment center Id is required!');
    }
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
      vendor_id: body.vendor_id,
      custom_fields: [],
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
