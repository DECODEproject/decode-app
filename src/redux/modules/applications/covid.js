import { createSelector } from 'reselect';
import { path, prop, append } from 'ramda';
import moment from 'moment';
import uuid from 'uuid/v4';
import { toggle } from 'lib/utils';
import loginApi from 'api/login-client';
import { APPLICATION_ACTIONS } from './actions';
import { debugLog } from 'lib/utils';
import zenroom from 'api/zenroom-client';
import {
    generatesk1,
    generatesk2,
    generateEphids
} from 'api/zenroom/dp3t';

export const initialState = {
    loading: false,
    loggedIn: false,
    selectedAttributes: [],
    uses: [],
    certificates: {},
    error: null,
    steps: 2,
    step: 1,
    sk1: null,
    sk2: null,
    moments: { moments: '8' },
    ephids: null
};


export const ACTIONS = {
    SK_SUCCESS: 'SK_SUCCESS',
    SK2_GENERATE: 'SK2_GENERATE',
    EPHIDS_GENERATE: 'EPHIDS_GENERATE',
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    TOGGLE_SELECTED_ATTRIBUTE: 'TOGGLE_SELECTED_ATTRIBUTE',
    CLEANUP_STATE: 'CLEANUP_STATE',
};

export const getGeneratedEphids = (data, key) => async (dispatch) => {

    let ephids = null;
    if(data && key){
        try {
            const tmpData = JSON.stringify(data);
            const tmpKey = JSON.stringify(key);
            ephids = await zenroom.execute(generateEphids(), tmpData, tmpKey);

        } catch (e) {
            console.log('********** REDUX ACTION getGeneratedEphids error found!');
            console.log(e);
        }
    }
    
    dispatch({
        type: ACTIONS.EPHIDS_GENERATE,
        ephids
    });
} 

export const getGeneratedSK2 = (sk1) => async (dispatch) => {
    let sk2 = null
    if (sk1) {
        try {
            sk2 = await zenroom.execute(generatesk2(), sk1, '');
        } catch (e) {
            console.log('********** REDUX ACTION generateSK2 error found!');
            console.log(e);
        }
    }
    dispatch({
        type: ACTIONS.SK2_GENERATE,
        sk2
    });

}

export const getGeneratedSK1 = () => async (dispatch) => {
    let sk1 = null;
    try {
        sk1 = await zenroom.execute(generatesk1(), '', '');
    } catch (e) {
        console.log('********** REDUX ACTION callZenroom error found!');
        console.log(e);
    }
    dispatch({
        type: ACTIONS.SK_SUCCESS,
        sk1
    });
};


const getBranch = path(['applications', 'covid']);

export const getSk1 = createSelector(
    getBranch,
    prop('sk1'),
);

export const getSk2 = createSelector(
    getBranch,
    prop('sk2'),
);

export const getMoments = createSelector(
    getBranch,
    prop('moments'),
);

export const getEphids = createSelector(
    getBranch,
    prop('ephids'),
);


export default (state = initialState, action) => {
    switch (action.type) {
        case APPLICATION_ACTIONS.INIT_APPLICATION: {
            if (action.id !== 'covidtwo') return state;
            return {
                ...state,
                loading: false,
                error: null,
                loggedIn: false,
                step: 1,
            };
        }
        case ACTIONS.LOGIN_REQUEST: {
            return {
                ...state,
                loading: true,
                error: null,
                loggedIn: false,
            };
        }
        case ACTIONS.LOGIN_SUCCESS: {
            const { certificate } = action;
            const { petitionId = uuid() } = certificate;
            const { uses, selectedAttributes, certificates } = state;
            return {
                ...state,
                loading: false,
                loggedIn: true,
                step: 2,
                uses: append({
                    date: +moment(),
                    sharedData: selectedAttributes,
                },
                    uses),
                certificates: {
                    ...certificates,
                    [petitionId]: certificate,
                },
            };
        }
        case ACTIONS.LOGIN_FAILURE: {
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        }
        case ACTIONS.TOGGLE_SELECTED_ATTRIBUTE: {
            const { selectedAttributes } = state;
            return {
                ...state,
                selectedAttributes: toggle(action.id, selectedAttributes),
            };
        }
        case ACTIONS.SK_SUCCESS: {
            const { sk1 } = action;
            return {
                ...state,
                sk1
            };
        }
        case ACTIONS.SK2_GENERATE: {
            const { sk2 } = action;
            return {
                ...state,
                sk2
            };
        }
        case ACTIONS.EPHIDS_GENERATE: {
            const { ephids } = action;
            return {
                ...state,
                ephids
            };
        }
        default:
            return state;
    }
};
