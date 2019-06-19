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

import { createSelector } from 'reselect';
import { prop } from 'ramda';

const initialState = {
  pin1: '',
  pin2: '',
  validationError: null,
  pin: undefined,
};

export const ACTIONS = {
  PIN1_CHANGED: 'PIN1_CHANGED',
  PIN2_CHANGED: 'PIN2_CHANGED',
  VALIDATE_PIN: 'VALIDATE_PIN',
  RESET_PIN: 'RESET_PIN',
};

export const changePin1 = pin => ({
  type: ACTIONS.PIN1_CHANGED,
  pin,
});

export const changePin2 = pin => ({
  type: ACTIONS.PIN2_CHANGED,
  pin,
});

export const validatePin = () => ({
  type: ACTIONS.VALIDATE_PIN,
});

export const resetPin = () => ({
  type: ACTIONS.RESET_PIN,
});

const getBranch = prop('pin');

export const getPin1 = createSelector(
  getBranch,
  prop('pin1'),
);

export const getPin2 = createSelector(
  getBranch,
  prop('pin2'),
);

export const getPin = createSelector(
  getBranch,
  prop('pin'),
);

export const getValidationError = createSelector(
  getBranch,
  prop('validationError'),
);

const runValidation = (pin1, pin2) => {
  if (pin1.match(/\D/)) return 'numbersOnly';
  if (pin1.length < 4) return 'min4Digits';
  if (pin1 !== pin2) return 'notEqual';
  return null;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.PIN1_CHANGED: {
      const { pin } = action;
      return {
        ...state,
        pin1: pin,
      };
    }
    case ACTIONS.PIN2_CHANGED: {
      const { pin } = action;
      return {
        ...state,
        pin2: pin,
      };
    }
    case ACTIONS.VALIDATE_PIN: {
      const { pin1, pin2, pin } = state;
      const error = runValidation(pin1, pin2);
      return {
        ...state,
        validationError: error,
        pin: error ? pin : pin1,
      };
    }
    case ACTIONS.RESET_PIN: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};
