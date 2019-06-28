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
import { Button, FlatList } from 'react-native';
import { isEmpty } from 'ramda';
import { useTranslation } from 'react-i18next';
import EmptyList from './EmptyList';
import { Container, ListContainer, ButtonsContainer } from './AttributeList.Styles';
import AttributeItem, { AttributeItemPropType } from './AttributeItem/AttributeItem.Component';

const AttributeList = ({ attributes, navigation: { navigate } }) => {
  const { t } = useTranslation('attributes');
  return (
    <Container>
      <ListContainer>
        {isEmpty(attributes) ? (<EmptyList />)
          : (
            <FlatList
              data={attributes}
              renderItem={({ item }) => <AttributeItem item={item} t={t} navigate={navigate} />}
              keyExtractor={item => item.name}
            />
          )
      }
      </ListContainer>
      <ButtonsContainer>
        <Button
          title={t('add')}
          onPress={() => navigate('AtlasList')}
        />
      </ButtonsContainer>
    </Container>
  );
};

AttributeList.displayName = 'AttributeList';

AttributeList.propTypes = {
  attributes: PropTypes.arrayOf(AttributeItemPropType).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

AttributeList.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('attributes:my'),
});

export default AttributeList;
