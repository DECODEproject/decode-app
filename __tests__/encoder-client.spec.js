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
import EncoderClient from '../src/api/encoder-client';
import EncoderError from '../src/api/errors/encoder-error';

describe('Encoder client', () => {
  afterEach(() => {
    mockAxios.post.mockClear();
  });

  const encoder = new EncoderClient('https://encoder.test');

  const streamConfiguration = {
    device_token: 'abc123',
    community_id: 'a8463397-2411-4f4a-8294-eef41dc41a5e',
    recipient_public_key: 'f99538cf2b2d5472c0da9316b1b51b55',
    location: {
      longitude: 2.512,
      latitude: 54.125,
    },
    exposure: 'INDOOR',
    operations: [],
  };

  const stream = {
    stream_uid: 'd5eae59b-050f-4f64-bf8c-4c9b7e39ff9a',
    token: 'isM4wxuUH3JDrUOg7WvDBdHx4mQiMyW4A3h0Amfzg2I=',
  };

  test('should set full url when constructed', () => {
    expect(encoder.url).toEqual('https://encoder.test/twirp/decode.iot.encoder.Encoder');
  });

  test('should create stream', async () => {
    // define our mocked response
    mockAxios.post.mockImplementationOnce(() => Promise.resolve({
      data: stream,
    }));


    const response = await encoder.createStream(streamConfiguration);
    expect(response).toEqual(stream);

    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://encoder.test/twirp/decode.iot.encoder.Encoder/CreateStream',
      streamConfiguration,
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
      await encoder.createStream(streamConfiguration);
    } catch (e) {
      expect(e).toBeInstanceOf(EncoderError);
      expect(e.message).toBe('Error creating stream: An error occurred');
    }
  });

  test('should delete stream', async () => {
    // define our mocked response
    mockAxios.post.mockImplementationOnce(() => Promise.resolve({
      data: {},
    }));

    await encoder.deleteStream(stream);

    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://encoder.test/twirp/decode.iot.encoder.Encoder/DeleteStream',
      stream,
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
      await encoder.deleteStream(stream);
    } catch (e) {
      expect(e).toBeInstanceOf(EncoderError);
      expect(e.message).toBe('Error deleting stream: An error occurred');
    }
  });
});
