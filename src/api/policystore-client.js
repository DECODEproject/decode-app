/*
 * DECODE App – A mobile app to control your personal data
 *
 * Copyright (C) 2019 – DRIBIA Data Research S.L.
 *
 * DECODE App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DECODE App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * email: info@dribia.com
 */

import axios from 'axios';
import { debugLog } from 'lib/utils';
import PolicystoreError from './errors/policystore-error';

const prefix = '/twirp/decode.iot.policystore.PolicyStore';

/**
 * @typedef {Object} Policy - Object containing the definition of a community
 *     policy
 * @property {string} community_id - Identifier of the community
 * @property {string} label - The title of the community
 * @property {Object} descriptions - Object containing translated descriptions
 *     of the community
 * @property {string} descriptions.ca - Català language description of the
 *     community
 * @property {string} descriptions.en - English language description of the
 *     community
 * @property {string} descriptions.es - Castellano language description of the
 *     community
 * @property {Object[]} operations - List of operations to apply to the device
 * @property {number} operations[].sensor_id - Numeric identifier of a sensor
 * @property {string} operations[].action - Action to apply to the sensor (one
 *     of SHARE, BIN, MOVING_AVG)
 * @property {number[]} operations[].bins - Array of numbers defining a set of
 *     bins into which values should be classified. Required for BIN, an error if
 *     present for other actions
 * @property {number} operations[].interval - Interval in seconds over which
 *     moving average should be calculated. Required for MOVING_AVG, an error if
 *     present for other actions
 * @property {string} public_key - Public key part of the communities'
 *     encryption keypair
 * @property {string} authorizable_attribute_id - Identifier of the authorizable
 *     attribute id used for the Coconut flow
 * @property {string} credential_issuer_endpoint_url - URL to which Coconut auth
 *     requests should be sent
 */

/**
 * Client for the IoT Policystore. The Policystore maintains a list of
 * available communities which users may choose to add their device to. Joining
 * a community means creating an encrypted stream which processes and
 * transforms the data using the operations defined in the communities policy
 * and encrypting the data with the credentials belonging to the community.
 */
class PolicystoreClient {
  constructor(url = 'https://policystore.decodeproject.eu') {
    this.url = `${url}${prefix}`;
  }

  /**
   * Returns a list of available community policies that a user may choose to
   * add their device to.
   *
   * @return {Policy[]} - the list of policies
   */
  async listPolicies() {
    try {
      const url = `${this.url}/ListEntitlementPolicies`;
      debugLog('Going to call: ', url);

      const { data: { policies } } = await axios.post(url, {}, { headers: { 'Content-Type': 'application/json' } });
      debugLog('Response: ', policies);
      return policies;
    } catch (error) {
      debugLog('Error: ', error);
      const { response: { data: { msg, meta } } } = error;
      debugLog('Error data: ', JSON.stringify(meta));
      throw new PolicystoreError(`Error listing policies: ${msg}`);
    }
  }
}

export default PolicystoreClient;
