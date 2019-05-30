import { prop } from 'ramda';
import { getStats } from '../../api/credential-issuer-client';

const initialState = {
  greeting: 'This is the DECODE app v2',
  total: '---',
};

const ACTIONS = {
  REFRESH_STATS_REQUEST: 'REFRESH_STATS_REQUEST',
  REFRESH_STATS_SUCCESS: 'REFRESH_STATS_SUCCESS',
  REFRESH_STATS_FAILURE: 'REFRESH_STATS_FAILURE',
};

export const refreshStats = () => async (dispatch) => {
  dispatch({
    type: ACTIONS.REFRESH_STATS_REQUEST,
  });
  try {
    const { total } = await getStats();
    dispatch({
      type: ACTIONS.REFRESH_STATS_SUCCESS,
      total,
    });
  } catch (e) {
    dispatch({
      type: ACTIONS.REFRESH_STATS_FAILURE,
      e,
    });
  }
};

export const getGreeting = prop('greeting');

export const getTotal = prop('total');

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.REFRESH_STATS_REQUEST: {
      return {
        ...state,
        total: '...',
      };
    }
    case ACTIONS.REFRESH_STATS_SUCCESS: {
      const { total } = action;
      return {
        ...state,
        total,
      };
    }
    case ACTIONS.REFRESH_STATS_FAILURE: {
      return {
        ...state,
        total: 'XXX',
      };
    }
    default:
      return state;
  }
};
