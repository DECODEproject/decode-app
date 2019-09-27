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
import {
  prop,
  mapObjIndexed,
  values,
  compose,
  omit,
  keys,
  merge,
  map,
  pick,
  contains,
  filter,
  reject,
  isNil,
  apply,
  assoc,
  propEq,
} from 'ramda';
import { encrypt, decrypt } from 'lib/utils';
import { listAttributes, getApplication } from 'api/atlas-client';
import converters from '../converters';

const initialState = {};

export const ACTIONS = {
  SAVE_ATTRIBUTE: 'SAVE_ATTRIBUTE',
  DELETE_ATTRIBUTE: 'DELETE_ATTRIBUTE',
};

export const saveAttribute = (id, value) => ({
  type: ACTIONS.SAVE_ATTRIBUTE,
  id,
  value,
});

export const deleteAttribute = id => ({
  type: ACTIONS.DELETE_ATTRIBUTE,
  id,
});

const getStoreBranch = prop('attributes');

export const getAttribute = id => createSelector(
  getStoreBranch,
  compose(
    decrypt,
    prop(id),
  ),
);

const allAtlasAttributes = reject(propEq('hidden', true))(listAttributes());

const isBaseAttribute = compose(isNil, prop('derivedFrom'));

const baseAttributes = filter(isBaseAttribute, allAtlasAttributes);

export const addAtlasInfo = attr => merge(attr, allAtlasAttributes[attr.name]);

export const addBaseAttributeInfo = (attr) => {
  const { derivedFrom } = attr;
  return derivedFrom ? assoc('baseAttribute', allAtlasAttributes[derivedFrom], attr) : attr;
};

export const getAllAttributes = createSelector(
  getStoreBranch,
  compose(
    values,
    map(addAtlasInfo),
    mapObjIndexed((value, name) => ({
      name,
      value: decrypt(value),
    })),
  ),
);

export const getAllAttributeNames = createSelector(
  getStoreBranch,
  keys,
);

export const getFilteredAtlasAttributes = createSelector(
  getAllAttributeNames,
  compose(
    values,
    allAttributeNames => omit(allAttributeNames, baseAttributes),
  ),
);

const addDerivedAttributes = applicationId => (attrs) => {
  const attrNames = keys(attrs);
  const { sharedAttributes: applicationSharedAttributeNames } = getApplication(applicationId);
  const applicationSharedAttributes = pick(applicationSharedAttributeNames, allAtlasAttributes);
  const filterNames = filter(
    ({
      name,
      derivedFrom,
    }) => contains(name, attrNames) || contains(derivedFrom, attrNames),
  );
  const addValues = map(
    (attr) => {
      const { name, derivedFrom, config, baseAttribute } = attr;
      if (derivedFrom && baseAttribute) {
        const converter = prop(name, converters);
        if (converter) return {
          ...attr,
          value: JSON.stringify(apply(converter, [
            +prop('value')(attrs[derivedFrom]),
            config,
          ])),
          baseAttribute: {
            value: prop('value')(attrs[baseAttribute.name]),
            ...baseAttribute,
          },
        };
        return {
          ...attr,
          value: 'could not calculate',
        };
      }
      return {
        ...attr,
        value: prop('value')(attrs[name]),
      };
    },
  );
  return compose(
    addValues,
    map(addBaseAttributeInfo),
    filterNames,
  )(applicationSharedAttributes);
};

export const getSharedAttributes = applicationId => createSelector(
  getStoreBranch,
  compose(
    values,
    addDerivedAttributes(applicationId),
    map(addAtlasInfo),
    mapObjIndexed((value, name) => ({
      name,
      value: decrypt(value),
    })),
  ),
);

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SAVE_ATTRIBUTE: {
      const { id, value } = action;
      return {
        ...state,
        [id]: encrypt(value),
      };
    }
    case ACTIONS.DELETE_ATTRIBUTE: {
      const { id } = action;
      const { [id]: filteredOut, ...rest } = state;
      return {
        ...rest,
      };
    }
    default:
      return state;
  }
};
