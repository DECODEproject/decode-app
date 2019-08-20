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
import CredentialIssuerError, { errors } from './errors/credential-issuer-error';

class CredentialIssuerClient {
  constructor(url) {
    this.url = url;
  }

  async getStats() {
    try {
      console.log('Going to call: ', `${this.url}/stats`);
      const { data } = await axios.get(`${this.url}/stats/`);
      console.log('Response from credential issuer: ', data);
      return data;
    } catch (error) {
      throw new CredentialIssuerError(`Error getting credential issuer id: ${error}`);
    }
  }

  async getIssuerId() {
    try {
      console.log('Going to call: ', `${this.url}/uid`);
      const { data } = await axios.get(`${this.url}/uid`);
      console.log('Response from credential issuer: ', data);
      const { credential_issuer_id: credentialIssuerId } = data;
      if (credentialIssuerId) return credentialIssuerId;
    } catch (error) {
      throw new CredentialIssuerError(`Error getting credential issuer id: ${error}`);
    }
    throw new CredentialIssuerError('Error getting credential issuer id: No id returned');
  }

  async getIssuerVerifier(authorizableAttributeId) {
    let message = '';
    try {
      console.log('Going to call: ', `${this.url}/authorizable_attribute/${authorizableAttributeId}`);
      const { data, status } = await axios.get(`${this.url}/authorizable_attribute/${authorizableAttributeId}`);
      console.log('Response from credential issuer: ', status, data);
      if (status === 200) {
        const { verification_key: verificationKey } = data;
        if (verificationKey) return verificationKey;
      } else {
        const { detail } = data;
        message = `Error getting credential issuer verifier: ${detail}`;
      }
    } catch (error) {
      throw new CredentialIssuerError(`Error getting credential issuer verifier: ${error}`);
    }
    throw new CredentialIssuerError(message);
  }

  async issueCredential(authorizableAttributeId, blindSignRequest, verifyingData, optionalData) {
    let response;
    const values = [];
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const k in verifyingData) values.push({
      name: k,
      value: verifyingData[k],
    });

    const optionalValues = [];
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const k in optionalData) optionalValues.push({
      name: k,
      value: optionalData[k],
    });

    const jsonBody = {
      authorizable_attribute_id: authorizableAttributeId,
      blind_sign_request: blindSignRequest,
      values,
      optional_values: optionalValues,
    };
    console.log('Going to call: ', `${this.url}/credential`);
    console.log('JSON body: ', jsonBody);

    try {
      response = await axios.post(`${this.url}/credential/`, jsonBody);
      const { data } = response;
      console.log('Response from credential issuer: ', data);
      return data;
    } catch (error) {
      const { response: { status, data: { detail } } } = error;
      if (status === 412) if (detail === 'Credential already issued') {
        throw new CredentialIssuerError(errors.ALREADY_ISSUED);
      } else if (detail === 'Values mismatch not in Authorizable Attribute') {
        throw new CredentialIssuerError(errors.NOT_VALID);
      } else if (detail.indexOf('Missing mandatory value') === 0) {
        throw new CredentialIssuerError(errors.MISSING_VALUE);
      } else if (detail) {
        throw new CredentialIssuerError(detail);
      } else {
        throw new CredentialIssuerError(`Error calling credential issuer: ${error}`);
      }
      else throw new CredentialIssuerError(`Error calling credential issuer: ${error} | ${JSON.stringify(detail)}`);
    }
  }
}

export default CredentialIssuerClient;
