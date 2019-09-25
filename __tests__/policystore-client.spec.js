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

import mockAxios from 'axios';
import PolicystoreClient from 'api/policystore-client';
import PolicystoreError from '../src/api/errors/policystore-error';

describe('Policystore client', () => {
  afterEach(() => {
    mockAxios.post.mockClear();
  });

  const policystore = new PolicystoreClient('https://policystore.test');

  test('should set url prefix when constructed', () => {
    expect(policystore.url).toEqual('https://policystore.test/twirp/decode.iot.policystore.PolicyStore');
  });

  test('should use default policystore url if none supplied', () => {
    const defaultPolicystore = new PolicystoreClient();
    expect(defaultPolicystore.url).toEqual('https://policystore.decodeproject.eu/twirp/decode.iot.policystore.PolicyStore');
  });

  test('should return policies', async () => {
    mockAxios.post.mockImplementationOnce(() => Promise.resolve({
      data: {
        policies: [
          {
            community_id: 'community-id',
            label: 'All Public',
            operations: [],
            public_key: 'public-key',
            authorizable_attribute_id: 'authorizable-attribute-id',
            credential_issuer_endpoint_url: 'https://credentials.decodeproject.eu',
            descriptions: {
              ca: 'Una comunitat que comparteix totes les dades.',
              en: 'A community that shares all data.',
              es: 'Una comunidad que comparte todos los datos.',
            },
          },
        ],
      },
    }));

    const response = await policystore.listPolicies();
    expect(response).toEqual([
      {
        community_id: 'community-id',
        label: 'All Public',
        operations: [],
        public_key: 'public-key',
        authorizable_attribute_id: 'authorizable-attribute-id',
        credential_issuer_endpoint_url: 'https://credentials.decodeproject.eu',
        descriptions: {
          ca: 'Una comunitat que comparteix totes les dades.',
          en: 'A community that shares all data.',
          es: 'Una comunidad que comparte todos los datos.',
        },
      },
    ]);
    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://policystore.test/twirp/decode.iot.policystore.PolicyStore/ListEntitlementPolicies',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
  });

  test('should throw an error on failure', async () => {
    mockAxios.post.mockRejectedValueOnce({
      response: {
        data: {
          msg: 'An error occurred',
          meta: {
            twirp_invalid_route: 'POST /foo',
          },
        },
      },
    });

    try {
      await policystore.listPolicies();
    } catch (e) {
      expect(e).toBeInstanceOf(PolicystoreError);
      expect(e.message).toBe('Error listing policies: An error occurred');
    }
  });
});
