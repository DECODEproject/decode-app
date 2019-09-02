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
import { prop, isNil } from 'ramda';
import { Text } from 'lib/styles';
import Switch from 'lib/Components/Switch';
import { Wrapper, RowWrapper, Check, CheckWrapper, LabelWrapper, SwitchWrapper } from './CheckList.Styles';

const CheckList = ({ items }) => (
  <Wrapper>
    <FlatList
      data={items}
      keyExtractor={prop('label')}
      renderItem={
        ({ index, item: { label, checked, onSwitch } }) => (
          <RowWrapper first={index === 0}>
            <LabelWrapper>
              <Text>{label}</Text>
            </LabelWrapper>
            {onSwitch ? (
              <SwitchWrapper>
                {isNil(checked) ? (<Text> </Text>)
                  : <Switch value={checked} onValueChange={onSwitch} />
                }
              </SwitchWrapper>
            ) : (
              <CheckWrapper>
                <Check name={checked ? 'check' : null} />
              </CheckWrapper>
            )
            }
          </RowWrapper>
        )
      }
    />
  </Wrapper>
);

CheckList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onSwitch: PropTypes.func,
  })).isRequired,
};

export default CheckList;
