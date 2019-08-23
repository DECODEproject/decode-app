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

export default (uniqueId, issuerId, petitionId) => `-- 0 for silent logging
ZEN:begin(0)

ZEN:parse([[
Scenario 'coconut': "Sign petition: the Citizen signs the petition, with his own keys, aggregating it with the credential and with the Credential Issuer public key"
Given that I am known as '${uniqueId}' 
and I have my keypair
and I have a signed credential
and I use the verification key by '${issuerId}'
When I aggregate all the verification keys
and I sign the petition '${petitionId}'
Then print all data
]])

ZEN:run()
`;
