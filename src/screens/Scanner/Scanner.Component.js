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
import { NavigationEvents } from 'react-navigation';
import { Text } from 'react-native';
import { withTranslation } from 'react-i18next';
import { Screen, Header } from 'lib/Components';
import { parseQRCode } from 'lib/utils';
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
    const { navigation, t } = this.props;
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
                onBarCodeRead={(ev) => {
                  const { error, application, ...rest } = parseQRCode(ev.data);
                  if (application) navigation.navigate(application, { application, ...rest });
                  if (error) navigation.navigate('Error', { message: t('error'), detail: error });
                  this.setState(prevState => ({
                    ...prevState,
                    qrcode: ev.data,
                  }));
                }}
              />
            ) : <Text>{qrcode}</Text>)
            : <Text>Camera not in use</Text>
        }
      </Screen>
    );
  }
}

Scanner.navigationOptions = ({ screenProps: { t } }) => ({
  headerTitle: <Header title={t('scanner:title')} icon="qrcode" />,
});

Scanner.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(Scanner);
