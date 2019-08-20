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

export default (uniqueId, issuerId) => `-- 0 for silent logging
ZEN:begin(0)

ZEN:parse([[
Scenario 'coconut': "To run by citizen and send the result blindproof_credential.json to the verifier/checker"
Given that I am known as '${uniqueId}'
and I have my credential keypair
and I use the verification key by '${issuerId}'
and I have a signed credential
When I aggregate all the verification keys
and I generate a credential proof
Then print all data
]])

ZEN:run()`;
