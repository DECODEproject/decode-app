export default () => `
scenario 'dp3t': Decentralized Privacy-Preserving Proximity Tracing
rule check version 1.0.0
rule input encoding hex
rule output encoding hex
Given I have a valid 'secret day key'
When I renew the secret day key to a new day
Then print the 'secret day key'
`;

