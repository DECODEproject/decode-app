/*
 * DECODE Proximity App
 *
 * Copyright (C) 2019 – Dyne.org
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
 */

export default () => `
rule check version 1.0.0
Scenario simple: Generate a random password
Given nothing
When I create the array of '1' random objects of '256' bits
and I rename the 'array' to 'secret day key'
Then print the 'secret day key'
`;
