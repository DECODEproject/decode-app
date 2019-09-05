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
import { Touchable, Wrapper, Label, Icon } from './Button.Styles';

const Button = ({ title, onPress, icon, featured, ...rest }) => (
  <Touchable onPress={onPress} featured={featured} {...rest}>
    <Wrapper>
      {icon ? (
        <Icon name={icon} featured={featured} />
      ) : null}
      <Label featured={featured}>{title}</Label>
    </Wrapper>
  </Touchable>
);

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
  featured: PropTypes.bool,
};

Button.defaultProps = {
  icon: null,
  featured: false,
};

export default Button;
