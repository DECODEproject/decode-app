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
import EncoderError from './errors/encoder-error';

const prefix = '/twirp/decode.iot.encoder.Encoder';

/**
 * @typedef {Object} StreamConfiguration - Object containing the complete
 *     definition of a stream
 * @property {string} device_token - Identifier of a device (supplied when
 *     onboarding)
 * @property {string} community_id - Identifier of the the chosen community
 * @property {string} recipient_public_key - Public key part of the
 *     communities' encryption keypair
 * @property {Object} location - The geographical location of the device
 * @property {number} location.longitude - The decimal longitude of the
 *     location
 * @property {number} location.latitude - The decimal latitude of the location
 * @property {string} exposure - The exposure of the device (one of INDOOR or
 *     OUTDOOR)
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
 */

/**
 * @typedef {Object} Stream - Object containing the identifier and secret
 *     token for a stream
 * @property {string} stream_uid - Identifier of a stream
 * @property {string} token - Secret token required to delete the stream
 */

/**
 * Client for the IoT Stream Encoder. Exposes methods for creating or deleting
 * encrypted streams on the stream encoder service.
 */
class EncoderClient {
  constructor(url = 'https://encoder.decodeproject.eu') {
    this.url = `${url}${prefix}`;
  }

  /**
   * Create an encoded stream for a device which will start that device
   * collecting data for the chosen community.
   *
   * @param {StreamConfiguration} streamConfiguration - Configuration of the
   *     new encrypted stream to create
   * @return {Stream}
   */
  async createStream(streamConfiguration) {
    try {
      const url = `${this.url}/CreateStream`;
      debugLog('Going to call: ', url);

      const { data: stream } = await axios.post(url, streamConfiguration, { headers: { 'Content-Type': 'application/json' } });
      debugLog('Response: ', stream);
      return stream;
    } catch (err) {
      debugLog('Error: ', err);
      const { response: { data: { msg, meta } } } = err;
      debugLog('Error details: ', JSON.stringify(meta));
      throw new EncoderError(`Error creating stream: ${msg}`);
    }
  }

  /**
   * Delete an encoded stream, so stopping any new data being encrypted and
   * stored for that device configuration.
   *
   * @param {Stream} stream - The stream to delete
   */
  async deleteStream(stream) {
    try {
      const url = `${this.url}/DeleteStream`;
      debugLog('Going to call: ', url);

      await axios.post(url, stream, { headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      debugLog('Error: ', err);
      const { response: { data: { msg, meta } } } = err;
      debugLog('Error details: ', JSON.stringify(meta));
      throw new EncoderError(`Error deleting stream: ${msg}`);
    }
  }
}

export default EncoderClient;
