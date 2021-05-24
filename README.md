<p align="center"><a href="https://knawat.com/" target="_blank"><img src="https://knawat.com/wp-content/uploads/2017/10/253_77.png" alt="Knawat" width="300"></a></p>

<p align="center">
  <a href="https://gitter.im/Knawat/Lobby" rel="nofollow">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="Join the chat at Knawat">
  </a>
  <a href="https://isitmaintained.com/project/Knawat/knawat-suppliers-npm">
    <img src="https://isitmaintained.com/badge/resolution/Knawat/knawat-suppliers-npm.svg" alt="Average time to resolve an issue"/>
  </a>
  <a href="https://isitmaintained.com/project/Knawat/knawat-suppliers-npm">
    <img src="https://isitmaintained.com/badge/open/Knawat/knawat-suppliers-npm.svg" alt="Percentage of issues still open"/>
  </a>
  <a href="https://npm-stat.com/charts.html?package=@knawat/suppliers">
    <img src="https://img.shields.io/npm/dm/@knawat/suppliers.svg" alt="npm"/>
  </a>
  <a href="https://www.npmjs.com/package/@knawat/suppliers">
    <img src="https://img.shields.io/npm/v/@knawat/suppliers.svg" alt="npm"/>
  </a>
  <a href="https://www.codacy.com/manual/Knawat/knawat-suppliers-npm?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Knawat/knawat-suppliers-npm&amp;utm_campaign=Badge_Grade">
    <img src="https://api.codacy.com/project/badge/Grade/08f6c384f3114941b6a882193cb0bb5c"/>
  </a>
</p>

# NPM Package to interact with zoho apis

A Node.js package for Zoho REST API. Easily interact with the Zoho APIS for zoho inventory purchase orders and vendors.

## Installation

```
npm install --save @knawat/zoho-finance
```

## Getting started

set env params
ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET
ZOHO_REFRESH_TOKEN
ZOHO_ORGANIZATION_ID

## Setup

Setup for the API integration:

```javascript

const { Vendors, PurchaseOrders } = require('@zoho-finance');

const zohoVendors = new Vendors();
const zohoInventory = new PurchaseOrders();

```

# Methods

## Vendor Methods

### getContactById

_Retrieve the vendor by vendor id

```javascript

zohoVendors.getContactById(vendor_id)
```

| Params           | Type     | Required | Description                                                                           |
| ---------------- | -------- | -------- | --------------------------------------------------------------------------------      |
| `vendor_id`      | `String` | Yes      | id of vendor                                                                          |

<small>https://www.zoho.com/inventory/api/v1/#Contacts_Get_contact</small>

### createContact

_Add vendor_

```javascript
const vendor = {
    name: 'John Doe',
    users: [
      {
        email: 'john.doe@mail.com',
        first_name: 'John',
        last_name: 'Doe'
      }
    ],
    companyName: 'vendor co',
    bankInformation:
      'swift_code: S123456\nrecipient_name: John Vanish Doe R\nrecipient_address: f/67 apt\naccount_number: A123456\nbank_country: TR\nbank_branch: awonroad\n',
    parentId: '5e281744188b8f0a28910311',
    billing: {
      first_name: 'John',
      last_name: 'Doe',
      address_1: 'A/78 Complex',
      address_2: 'A street',
      city: 'Istanbul',
      state: 'Turkey',
      postcode: '123456',
      country: 'ST',
      phone: '123456789'
    }
  }
zohoVendors.createContact(vendor);
```

| Option     | Type     | Required | Description                       |
| ---------- | -------  | -------- | --------------------------------- |
| `vendor`   | `Object` | yes      | Object of vendor                  | 

<small>https://www.zoho.com/inventory/api/v1/#Contacts_Create_a_Contact</small>

### updateContact

_Update vendor_

```javascript
const vendor = {
    name: 'John Doe',
    users: [
      {
        email: 'tom.doe@mail.com',
        first_name: 'John',
        last_name: 'Doe'
      }
    ],
    companyName: 'vendor co',
    bankInformation:
      'swift_code: S123456\nrecipient_name: John Vanish Doe R\nrecipient_address: f/67 apt\naccount_number: A123456\nbank_country: TR\nbank_branch: awonroad\n',
    parentId: '5e281744188b8f0a28910311',
    billing: {
      first_name: 'John',
      last_name: 'Doe',
      address_1: 'A/78 Complex',
      address_2: 'A street',
      city: 'Istanbul',
      state: 'Turkey',
      postcode: '123456',
      country: 'ST',
      phone: '123456789'
    }
  }
zohoVendors.updateContact(vendor_id, vendor)
```

| Option     | Type     | Required | Description                       |
| ---------- | -------  | -------- | --------------------------------- |
| `vendor`   | `Object` | yes      | Object of vendor                  |

<small>https://www.zoho.com/inventory/api/v1/#Contacts_Update_a_contact</small>


## Purchase Orders Methods

### getPurchaseOrders

_Lists all the Purchase Orders bu vendor id or fulfillment center id_

```javascript
const params = {
            vendor_id: 'xxxxxxxxxxxxxxx10014',
            fulfillment_center_id:'xxxxxxxxxxxxxxxxxxx10311',
            page: 1,
            per_page: 20,
            status: 'draft',
            purchaseorder_number: 'xxxxxxxxxxxxxxx1021',
          }
zohoInventory.getPurchaseOrders(params)
```

| Params                            | Type     | Required  | Description                                                                           |
| --------------------------------- | -------- | --------  | --------------------------------------------------------------------------------      |
| `vendor_id`                       | `String` | Yes       | Any of vendor_id or fulfillment_center_id is required                                 |
| `fulfillment_center_id`           | `String` | Yes       | Any of vendor_id or fulfillment_center_id is required                                 |
| `page`                            | `Number` | No        | Number of page to retrieve. `Default: 1`                                              |
| `per_page`                        | `String` | No        | Number of products to retrieve. `Default: 20`                                         |
| `status`                          | `String` | No        | 'open', 'issued', 'cancelled', 'billed', 'closed'                                     |
| `purchaseorder_number`            | `String` | No        | number of a purchase order                                                            |

<small>https://www.zoho.com/inventory/api/v1/#Purchase_Orders_List_all_Purchase_Orders</small>

### getPurchaseOrderById

_Retrieves the details for an existing Purchase Order._

```javascript
const params = {
            vendor_id: 'xxxxxxxxxxxxxxx10014',
            fulfillment_center_id:'xxxxxxxxxxxxxxxxxxx10311',
            include_comments: true,
          }
zohoInventory.getPurchaseOrderById(orderId, params)
```

| Params                            | Type      | Required  | Description                                                                           |
| --------------------------------- | --------  | --------  | --------------------------------------------------------------------------------      |
| `vendor_id`                       | `String`  | Yes       | Any of vendor_id or fulfillment_center_id is required                                 |
| `fulfillment_center_id`           | `String`  | Yes       | Any of vendor_id or fulfillment_center_id is required                                 |
| `include_comments`                | `Boolean` | No        | Include comments in purchase orders details. `Default: false`                         |

<small>https://www.zoho.com/inventory/api/v1/#Purchase_Orders_Retrieve_a_Purchase_Order</small>

### getComments

_Retrieves the comments for an existing Purchase Order._

```javascript
const params = {
            vendor_id: 'xxxxxxxxxxxxxxx10014',
            fulfillment_center_id:'xxxxxxxxxxxxxxxxxxx10311',
          }
zohoInventory.getComments(orderId, params)
```

| Params                            | Type      | Required  | Description                                                                           |
| --------------------------------- | --------  | --------  | --------------------------------------------------------------------------------      |
| `vendor_id`                       | `String`  | Yes       | Any of vendor_id or fulfillment_center_id is required                                 |
| `fulfillment_center_id`           | `String`  | Yes       | Any of vendor_id or fulfillment_center_id is required                                 |

### getPurchaseOrderById

_Retrieves the details for an existing Purchase Order._

```javascript
const params = {
            vendor_id: 'xxxxxxxxxxxxxxx10014',
            fulfillment_center_id:'xxxxxxxxxxxxxxxxxxx10311',
            include_comments: true,
          }
zohoInventory.getPurchaseOrderById(orderId, params)
```

| Params                            | Type      | Required  | Description                                                                           |
| --------------------------------- | --------  | --------  | --------------------------------------------------------------------------------      |
| `vendor_id`                       | `String`  | Yes       | Any of vendor_id or fulfillment_center_id is required                                 |
| `fulfillment_center_id`           | `String`  | Yes       | Any of vendor_id or fulfillment_center_id is required                                 |
| `include_comments`                | `Boolean` | No        | Include comments in purchase orders details. `Default: false`                         |

<small>https://www.zoho.com/inventory/api/v1/#Purchase_Orders_Retrieve_a_Purchase_Order</small>

### createPurchaseOrder

_Create new purchase order for vendor and fulfillment center_

```javascript
const body = {
                  line_items: [{
                        name: "[A2KT18A99401-1450S] Men's Turtleneck Basic Indigo Pullover",
                        id: "xxxxxxxxxxxxxx83215",
                        quantity: 2,
                        rate: 6.11,
                        description: "Colors: INDIGO\nBody: S\nSO-12345\ntest url",
                        taxId: "xxxxxxxxxxxxxx83215",
                    }]
            }
zohoInventory.createPurchaseOrder(vendor_id, fulfillment_center_id, body)
```

| Params                            | Type      | Required  | Description                                                                           |
| --------------------------------- | --------  | --------  | --------------------------------------------------------------------------------      |
| `vendor_id`                       | `String`  | Yes       | vendor_id                                                                             |
| `fulfillment_center_id`           | `String`  | Yes       | fulfillment_center_id                                                                 |

<small>https://www.zoho.com/inventory/api/v1/#Purchase_Orders_Create_a_Purchase_Order</small>

### updatePurchaseOrder

_Update new purchase order for vendor and fulfillment center_

```javascript
const body = {
                  line_items: [{
                        name: "[A2KT18A99401-1450S] Men's Turtleneck Basic Indigo Pullover",
                        id: "xxxxxxxxxxxxxx83215",
                        quantity: 2,
                        rate: 6.11,
                        description: "Colors: INDIGO\nBody: S\nSO-12345\ntest url",
                        taxId: "xxxxxxxxxxxxxx83215",
                    }]
            }
zohoInventory.updatePurchaseOrder(orderId, body)
```

<small>https://www.zoho.com/inventory/api/v1/#Purchase_Orders_Update_a_Purchase_Order</small>


### addOrderComment

_Add comment on purchase order_

```javascript
const body = {
                expectedDeliveryDate: "2021-05-20",
                description: "Products shipped",
             }
zohoInventory.addOrderComment(orderId, vendor_id, body)
```

### setPoTrackingNumber

_Add shipment tracking on purchase order_

```javascript
const body = {
                shipmentTrackingNumber: "12547586868",
                shipVia: "EMS",
            }
zohoInventory.setPoTrackingNumber(orderId, vendor_id, body)
```

### status

_Update status of PO_

```javascript
zohoInventory.status(orderId, vendor_id, status)
```

### createReceive

_Update received items of PO_

```javascript
const body = {
                date: "2021-05-20",
                line_items: [{
                            line_item_id: "2323832000005879079",
                            quantity: 1
                        }]
            }
zohoInventory.createReceive(orderId, fulfillment_center_id, body) 
```