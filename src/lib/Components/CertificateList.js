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

import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { values, prop } from 'ramda';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getLanguage } from 'lib/utils';
import { Text } from 'lib/styles';

const CertificateList = ({ certificates }) => (
  <FlatList
    data={values(certificates)}
    keyExtractor={prop('attributeId')}
    renderItem={({ item: { credentialName } }) => (
      <Text>
        <Icon name="check" />
        {` ${credentialName[getLanguage()]}`}
      </Text>
    )}
  />
);

CertificateList.propTypes = {
  certificates: PropTypes.object.isRequired,
};

export default CertificateList;
