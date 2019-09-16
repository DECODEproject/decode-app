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
import { StatusBar } from 'react-native';
import { ApplicationImage } from 'lib/styles';
import { getImage } from 'api/atlas-client';
import { SafeAreaView, ScrollWrapper } from './Screen.Styles';

const Screen = ({ children, scroll, image, ...rest }) => {
  const imageComponent = image ? <ApplicationImage source={getImage(image)} resizeMode="contain" /> : null;
  return (
    <SafeAreaView {...rest}>
      <StatusBar barStyle="light-content" />
      {
        scroll ? (
          <ScrollWrapper nestedScrollEnabled={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
            {imageComponent}
            {children}
          </ScrollWrapper>
        ) : (
          <React.Fragment>
            {imageComponent}
            {children}
          </React.Fragment>
        )
      }
    </SafeAreaView>
  );
};

Screen.defaultProps = {
  scroll: false,
  image: null,
};

Screen.propTypes = {
  scroll: PropTypes.bool,
  image: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Screen;
