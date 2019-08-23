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
import PetitionsError from 'api/errors/petitions-error';

class PetitionsClient {
  constructor(url = 'https://petitions.decodeproject.eu') {
    this.url = url;
  }

  async sign(petitionId, petitionSignature) {
    try {
      console.log('Going to call: ', `${this.url}/petitions/${petitionId}/sign`);
      console.log('JSON body: ', JSON.stringify(petitionSignature));
      const response = await axios.post(`${this.url}/petitions/${petitionId}/sign`, petitionSignature);
      console.log('Response: ', response);
      const { data } = response;
      console.log('Response OK from petitions service');
      console.log('Data: ', data);
    } catch (error) {
      console.log('Error: ', error);
      const { response: { data: { detail } } } = error;
      console.log('Error data: ', JSON.stringify(detail));
      throw new PetitionsError(`Error signing petition: ${detail || error}`);
    }
  }
}

export default PetitionsClient;
