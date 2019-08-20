
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
import { isEmpty, isNil, map } from 'ramda';
import { getLanguage } from 'lib/utils';

const throwError = async (response) => {
  const text = await response.text();
  throw new Error(text);
};

const throwParseError = (details) => {
  throw new Error(`Could not parse response from DDDC(${details})`);
};

const parseResponse = ({ data: { petition: { description, jsonSchema } } }) => {
  const { mandatory } = jsonSchema;
  if (isNil(mandatory) || isEmpty(mandatory)) throwParseError('mandatory');
  const credentialSpec = mandatory[0];
  const { verificationInput } = credentialSpec;
  if (isNil(verificationInput) || isEmpty(verificationInput)) throwParseError('verificationInput');
  return ({
    description: description[getLanguage()] || description.es,
    verificationCodes: map(({ id, name, type }) => ({
      id,
      type,
      name: name[getLanguage()] || name.es,
    }), verificationInput),
  });
};

const makeApiCall = async (url, petitionId) => {
  const graphQlQuery = `{
      petition(id: "${petitionId}") {
        id
        title
        description
        jsonSchema: json_schema
        attribute_id
      }
    }`.replace(/\n/g, '');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: graphQlQuery,
    }),
  });
  if (response.ok) return parseResponse(await response.json());

  return throwError(response);
};

export const fetchPetition = (url, petitionId) => makeApiCall(url, petitionId);
