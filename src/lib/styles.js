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

import { Text as RNText, TextInput as RNTextInput, Dimensions } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';

export const ActionWrapper = styled.View(({ theme: { backgroundColorAction } }) => ({
  backgroundColor: backgroundColorAction,
}));

export const Heading = styled(RNText)(({ theme: { primaryColor, fontFamily } }) => ({
  color: primaryColor,
  fontSize: 20,
  textAlign: 'center',
  fontFamily,
  fontWeight: 'bold',
}));

export const Text = styled(RNText)(({ theme: { primaryColor, fontFamily, fontSizeText } }) => ({
  color: primaryColor,
  textAlign: 'left',
  fontFamily,
  fontSize: fontSizeText,
  fontWeight: 'normal',
}));

export const Icon = styled(FAIcon)((
  { theme: { fontSizeIcon, primaryColor } },
) => ({
  fontSize: fontSizeIcon,
  color: primaryColor,
}));

export const ApplicationImage = styled.Image({
  width: '100%',
  height: Dimensions.get('window').height / 4,
});

export const TextInput = styled(RNTextInput)(
  ({ theme: { secondaryColor, fontFamily, fontSizeText } }) => ({
    fontFamily,
    fontSize: fontSizeText,
    borderColor: secondaryColor,
    borderWidth: 1,
    padding: 10,
    minWidth: Dimensions.get('window').width / 2,
    maxHeight: 100,
  }),
);
