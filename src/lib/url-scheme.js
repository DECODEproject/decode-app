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

import parseUrl from 'url-parse';
import { filter, propEq, isNil, head, keys, length, omit, difference, isEmpty } from 'ramda';
import { getUrlSchemes, getApplication } from 'api/atlas-client';
import { debugLog } from 'lib/utils';

export const errorObj = url => ({ error: `Unknown data in QR code: ${url}` });

const legacyParse = (urlObj) => {
  // Try to interpret as DDDC petition signing request
  const { query: { decidimAPIUrl, petitionId } } = urlObj;
  if (decidimAPIUrl && petitionId) return {
    application: 'dddc',
    decidimAPIUrl,
    petitionId,
  };

  // Try to interpret as login request to BCNNow
  const { query: { callback, sessionId }, hostname: action } = urlObj;
  if (action === 'login') if (callback && sessionId) return {
    application: 'bcnnow',
    callback,
    sessionId,
  };

  return false;
};

const parseApplication = (urlObj) => {
  const { hostname: action } = urlObj;
  if (isNil(action)) return null;
  const application = filter(propEq('action', action), getUrlSchemes());
  return length(keys(application)) === 1 ? head(keys(application)) : null;
};

const parseServiceId = (applicationId, urlObj) => {
  const { query: { serviceId } } = urlObj;
  const { urlScheme } = getApplication(applicationId);
  if (isNil(serviceId)) return null;
  return {
    [urlScheme.serviceId]: serviceId,
  };
};

const parseParameters = (applicationId, { query }) => {
  const urlParameters = omit(['serviceId'], query);
  const { urlScheme: { params: applicationParams } } = getApplication(applicationId);
  if (!isEmpty(difference(keys(urlParameters), applicationParams))) return null;
  return urlParameters;
};

export const parseQRCode = (url) => {
  debugLog('Url: ', url);
  const urlObj = parseUrl(url, true);
  const { protocol } = urlObj;
  debugLog('urlobj: ', urlObj);
  if (protocol === 'decodeapp:') {
    const applicationId = parseApplication(urlObj);
    debugLog('applicationId: ', applicationId);
    if (applicationId) {
      const serviceId = parseServiceId(applicationId, urlObj);
      debugLog('serviceId: ', serviceId);
      if (length(keys(serviceId)) === 1) {
        const parameters = parseParameters(applicationId, urlObj);
        debugLog('parameters: ', parameters);
        if (parameters) return {
          application: applicationId,
          ...serviceId,
          ...parameters,
        };
      }
    }
  }

  return legacyParse(urlObj) || errorObj(url);
};
