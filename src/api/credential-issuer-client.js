import { CREDENTIAL_ISSUER_URL } from '../lib/constants';
import { delay } from '../lib/utils';

const throwError = async (response) => {
  const text = await response.text();
  throw new Error(text);
};

const makeApiCall = async (url) => {
  await delay(2000); // Delay to make waiting more visible
  const response = await fetch(url);
  if (response.ok) return response.json();
  return throwError(response);
};

export const getStats = () => makeApiCall(`${CREDENTIAL_ISSUER_URL}/stats/`);
