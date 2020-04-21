export default () => `
scenario 'dp3t': Decentralized Privacy-Preserving Proximity Tracing
rule check version 1.0.0
rule input encoding hex
rule output encoding hex
Given I have a valid 'secret day key'
and I have a valid number in 'moments'
When I create the ephemeral ids for each moment of the day
and I randomize the 'ephemeral ids' array
Then print the 'ephemeral ids'
`;
