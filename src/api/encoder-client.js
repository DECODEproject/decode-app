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
