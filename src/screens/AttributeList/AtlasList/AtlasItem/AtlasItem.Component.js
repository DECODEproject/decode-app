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
import { RectButton } from 'react-native-gesture-handler';
import { Container, Name, Description } from './AtlasItem.Styles';

const AtlasItem = ({ t, item: { name, description }, navigate }) => (
  <RectButton
    key={name}
    onPress={() => navigate('EditAttribute', { name })}
  >
    <Container>
      <Name>{t(name)}</Name>
      <Description>{t(description)}</Description>
    </Container>
  </RectButton>
);

AtlasItem.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('chooseAttribute'),
});

export const AtlasItemPropType = PropTypes.shape({
  name: PropTypes.string,
  type: PropTypes.string,
  description: PropTypes.string,
});

AtlasItem.propTypes = {
  item: AtlasItemPropType.isRequired,
  t: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default AtlasItem;
