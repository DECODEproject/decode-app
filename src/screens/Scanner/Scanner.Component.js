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
import { NavigationEvents } from 'react-navigation';
import { Text } from 'react-native';
import { Screen } from 'lib/styles';
import { Camera } from './Scanner.Styles';

class Scanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      qrcode: '',
    };
  }

  focus() {
    this.setState(prevState => ({
      ...prevState,
      isFocused: true,
    }));
  }

  blur() {
    this.setState({
      qrcode: '',
      isFocused: false,
    });
  }

  render() {
    const { isFocused, qrcode } = this.state;
    return (
      <Screen>
        <NavigationEvents
          onWillFocus={() => this.focus()}
          onWillBlur={() => this.blur()}
        />
        {
          // eslint-disable-next-line no-nested-ternary
          isFocused
            ? (qrcode === '' ? (
              <Camera
                captureAudio={false}
                onBarCodeRead={ev => this.setState(prevState => ({
                  ...prevState,
                  qrcode: ev.data,
                }))}
              />
            ) : <Text>{qrcode}</Text>)
            : <Text>Camera not in use</Text>
        }
      </Screen>
    );
  }
}

Scanner.navigationOptions = ({ screenProps: { t } }) => ({
  title: t('Scanner'),
});

export default Scanner;
