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
