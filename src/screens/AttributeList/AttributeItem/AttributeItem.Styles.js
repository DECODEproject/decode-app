
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

import styled from 'styled-components/native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

export const Container = styled.View({
  borderBottomColor: '#ddd',
  borderBottomWidth: 1,
  flexDirection: 'row',
});

export const Info = styled.View({
  padding: 16,
  flex: 0.8,
  flexDirection: 'column',
});

export const Buttons = styled.View({
  padding: 16,
  flex: 0.2,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
});

export const Icon = styled(IconFontAwesome)({
  fontSize: 20,
});

export const Name = styled.Text({
  fontSize: 18,
  fontWeight: 'bold',
});

export const Value = styled.Text({
});
