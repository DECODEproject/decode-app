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

import { take, includes, without, append } from 'ramda';
import PropTypes from 'prop-types';
import aesjs from 'aes-js';
import uuid from 'uuid/v4';
import { STORAGE_KEY } from 'react-native-dotenv';
import parseUrl from 'url-parse';
import moment from 'moment';
import i18n from 'i18n';

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const upperFirst = str => str.replace(
  /^(.)/g,
  (match, ch) => (ch ? ch.toUpperCase() : ''),
);

export const childrenPropTypes = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

export const encrypt = (text) => {
  const key = aesjs.utils.hex.toBytes(STORAGE_KEY);
  const textBytes = aesjs.utils.utf8.toBytes(text);
  const paddedBytes = aesjs.padding.pkcs7.pad(textBytes);
  const buffer = [];
  const iv = uuid(null, buffer);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const encryptedBytes = aesCbc.encrypt(paddedBytes);
  const encryptedHex = aesjs.utils.hex.fromBytes([...iv, ...encryptedBytes]);
  return encryptedHex;
};

export const decrypt = (encryptedHex) => {
  const key = aesjs.utils.hex.toBytes(STORAGE_KEY);
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  const iv = encryptedBytes.slice(0, 16);
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const decryptedBytes = aesCbc.decrypt(encryptedBytes.slice(16));
  const decryptedStripped = aesjs.padding.pkcs7.strip(decryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedStripped);
  return decryptedText;
};

export const parseQRCode = (url) => {
  const urlObj = parseUrl(url, true);
  // Try to interpret as DDDC petition signing request
  const { query: { decidimAPIUrl: dddcUrl, petitionId } } = urlObj;
  if (dddcUrl && petitionId) return {
    application: 'dddc',
    dddcUrl,
    petitionId,
  };

  // Try to interpret as login request to BCNNow
  const { query: { callback: bcnnowUrl, sessionId }, hostname: action } = urlObj;
  if (action === 'login') if (bcnnowUrl && sessionId) return {
    application: 'bcnnow',
    bcnnowUrl,
    sessionId,
  };

  // Don't understand
  return {
    error: `Unknown data in QR code: ${url}`,
  };
};

export const getDisplayValue = (type, value, t) => {
  if (type === 'enum') return t(value);
  if (type === 'date') return moment(+value).format('L');
  return value;
};

export const getLanguage = () => take(2, i18n.language);

export const toggle = (item, list) => (includes(item, list)
  ? without(item, list)
  : append(item, list));

// eslint-disable-next-line no-console
export const debugLog = (...args) => console.log(...args);
