import fetch from 'node-fetch';
import config from './config';
import Bottleneck from 'bottleneck';

const rateLimitOptions = {
  // SP Default Rate Limit
  reservoir: 30,
  reservoirRefreshInterval: 60 * 1000,
  reservoirRefreshAmount: 30,
};
rateLimitOptions.timeout = rateLimitOptions.reservoirRefreshInterval * 3;
const group = new Bottleneck.Group(rateLimitOptions);

/**
 * A Class Library for handling Knawat MarketPlace related Operations.
 *
 * @class Request
 */
class Request {
  headers = config.HEADERS;

  constructor(params = {}) {
    this.clientId = process.env.ZOHO_CLIENT_ID;
    this.clientSecret = process.env.ZOHO_CLIENT_SECRET;
    this.refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    this.accessToken = '';
    this.accessTokenExpiry = '';
    if (!this.clientId || !this.clientSecret || !this.refreshToken) {
      throw new Error('Not a valid client id, client secret or refresh token');
    }
    const { apiRateLimit } = params;
    group.updateSettings(apiRateLimit);
    this.$fetch = group
      .key(this.refreshToken)
      .wrap(this.$fetch);
  }

  async setAuthHeaders(auth) {
    if (auth === 'Bearer') {
      await this.getTokenAuth();
      this.headers.authorization = `Bearer ${this.accessToken}`;
      return;
    }
    if (!auth || auth === 'none') {
      delete this.headers.authorization;
    }
  }

  /**
   * Generate access token from store key and secret
   *
   * @readonly
   * @memberof Products
   */
  async getTokenAuth() {
    if (
      this.accessToken !== '' &&
      this.accessTokenExpiry !== '' &&
      new Date() < this.accessTokenExpiry
    ) {
      return this.accessToken;
    }
    return this.getAccessToken();
  }

  /**
   * Generates a new access token
   *
   * @returns
   * @memberof Products
   */
  getAccessToken() {
    const path = 'https://accounts.zoho.com/oauth/v2/token';
    const params = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };
    return this.$fetch({
      path,
      method: 'POST',
      params,
      auth: 'none'
    }).then(res => {
      this.accessToken = res.access_token;
      const currDate = new Date();
      this.accessTokenExpiry = new Date(
        currDate.getTime() + res.expires_in * 1000
      );
      return this.accessToken;
    });
  }

  /**
   * Sanitize request params to remove undefined values
   */
  sanitizeParams(params) {
    Object.keys(params).forEach(
      key => params[key] === undefined && delete params[key]
    );
  }

  /**
   * Make http requests method for restAPIs
   *
   * @param {object} request
   * @param {string} request.path
   * @param {string} request.method @default 'get'
   * @param {object} request.body
   * @param {object} request.params
   *
   * @returns Promise<Json(Response)>
   */
  request({ path, method = 'GET', body, params = {}, auth }) {
    params.organization_id = process.env.ZOHO_ORGANIZATION_ID;
    path = `https://inventory.zoho.com/api/v1/${path}`;
    this.sanitizeCustomFields(params);
    return this.$fetch({ path, method, body, params, auth });
  }

  /**
   * Convert to zoho custom fields
   */
  sanitizeCustomFields(params) {
    if (params.fulfillment_center_id)
      params.cf_fulfillment_center_id = params.fulfillment_center_id;
  }

  /**
   * Fetch data from server
   *
   * @param {string} method
   * @param {string} path
   * @param {object} options
   */
  // Keep unthrottled fetch to use for async routes
  $fetch = this._fetch;
  async _fetch({ path, method = 'GET', body, params, auth }) {
    await this.setAuthHeaders(auth || 'Bearer');
    let queryString = '';
    if (params) {
      this.sanitizeParams(params);
      queryString = Object.keys(params).reduce(
        (accumulator, key) =>
          `${accumulator}${accumulator ? '&' : '?'}${key}=${params[key]}`,
        ''
      );
    }
    path = `${path}${queryString}`;
    return fetch(path, {
      method,
      body: JSON.stringify(body),
      headers: this.headers,
    })
      .then(async res => {
        const parsedRes = await res.json();
        if (!res.ok) {
          throw new Error(
            (parsedRes && parsedRes.error && parsedRes.error.message) ||
              parsedRes.message,
            res.status
          );
        }
        return parsedRes;
      })
      .catch(error => {
        throw error;
      });
  }

  /**
   * NOTE : `err.code` may return `ENOTFOUND` instead http status if address is not available or down.
   * And molecular is not handling strings like `ENOTFOUND` So handled it here.
   */
  errorFactory(err) {
    const errCode = Number.isNaN(Number(err.code)) ? 500 : err.code;
    throw new Error(err.message, errCode);
  }
}

module.exports = Request;
