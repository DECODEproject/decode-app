import { prop } from 'ramda';

const initialState = {
  greeting: 'This is the DECODE app v2',
};

export const getGreeting = prop('greeting');

export default (state = initialState/* , action */) => state;
