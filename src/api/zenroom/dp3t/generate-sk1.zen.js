export default () => `
    rule check version 1.0.0
    rule input encoding hex
    rule output encoding hex
    Given nothing
    When I create the random object of '256' bits
    and I rename the 'random object' to 'secret day key'
    Then print the 'secret day key'
`;

