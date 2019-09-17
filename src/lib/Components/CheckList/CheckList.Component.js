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
import { isNil } from 'ramda';
import { Switch } from 'lib/Components';
import {
  Wrapper,
  RowWrapper,
  Check,
  CheckWrapper,
  LabelWrapper,
  Label,
  ButtonWrapper,
  SwitchWrapper,
  ActionIcon,
  Empty,
} from './CheckList.Styles';

const CheckListItem = ({ label, checked, onSwitch, onEdit }, index) => (
  <RowWrapper key={label} first={index === 0}>
    <ButtonWrapper onPress={onEdit}>
      <LabelWrapper>
        <Label>{label}</Label>
        {
          onSwitch ? <ActionIcon name={isNil(checked) && onEdit ? 'plus' : 'pencil'} /> : <Empty />
        }
      </LabelWrapper>
    </ButtonWrapper>
    {onSwitch ? (
      <SwitchWrapper>
        {
          isNil(checked) ? <Empty /> : <Switch value={checked} onValueChange={onSwitch} />
        }
      </SwitchWrapper>
    ) : (
      <CheckWrapper>
        {
          <Check name={checked ? 'check' : null} />
        }
      </CheckWrapper>
    )
    }
  </RowWrapper>
);


const CheckList = ({ items }) => (
  <Wrapper>
    {
      items.map(CheckListItem)
    }
  </Wrapper>
);

CheckListItem.defaultProps = {
  checked: false,
  onSwitch: null,
  onEdit: null,
};

CheckListItem.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onSwitch: PropTypes.func,
  onEdit: PropTypes.func,
};

CheckList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(CheckListItem.propTypes)).isRequired,
};

export default CheckList;
