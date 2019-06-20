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
import { useTranslation } from 'react-i18next';
import { listAttributes } from 'api/atlas-client';
import { Container, Title, ListContainer } from './ListAtlas.Styles';
import AtlasItem, { AtlasItemPropType } from './AtlasItem/AtlasItem.Component';

const ListAtlas = ({ attributes }) => {
  const { t } = useTranslation('attributes');
  return (
    <Container>
      <Title>{t('available')}</Title>
      <ListContainer
        data={attributes}
        renderItem={({ item }) => <AtlasItem item={item} t={t} />}
        keyExtractor={item => item.name}
      />
    </Container>
  );
};

ListAtlas.displayName = 'ListAtlas';

ListAtlas.propTypes = {
  attributes: PropTypes.arrayOf(AtlasItemPropType),
};

ListAtlas.defaultProps = {
  attributes: listAttributes(),
};

export default ListAtlas;
