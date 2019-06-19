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

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getPin1, getPin2, changePin1, changePin2, validatePin, getValidationError,
} from 'redux/modules/pin';
import Component from './SetupPin.Component';

const mapStateToProps = createStructuredSelector({
  pin1: getPin1,
  pin2: getPin2,
  validationError: getValidationError,
});

const mapDispatchToProps = dispatch => ({
  onPin1Changed: pin => dispatch(changePin1(pin)),
  onPin2Changed: pin => dispatch(changePin2(pin)),
  onSetupDone: () => dispatch(validatePin()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);
