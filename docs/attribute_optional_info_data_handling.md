# Adding extra info to credentials: Flow description

> Notation: Ontology elements are noted in `CAPS` and variables like `$variable`.

## Preliminaries and references

* This flow builds on the contracts explained and coded in the [DDDC-Contract](https://github.com/DECODEproject/dddc-pilot-contracts) repo.
* The sourcecode of the example petition flow is on the [Zenroom repo petitions example](https://github.com/DECODEproject/zenroom/blob/master/examples/zencode_coconut/run_petition_example.sh)
* This document complements the two other docs for the pilot: [CREDENTIAL ISSUING NOTES](https://pad.dyne.org/code/#/2/code/edit/qA7Pf4d+sQYBP2MqYgOU0isN/) and [PETITION SIGNATURE FLOW NOTES](https://pad.dyne.org/code/#/2/code/edit/eXseOFE4-uoxoe7S3SY8fU7n/).


-------

## Introduction
This document is needed as per GDPR compliancy suggestions by our lawyers, **we cannot use the original contracts to store the information aggregated of users at time of petition**. The solution found is to **store this information at the Credential Issuer to track only info on people that participated by asking for a credential**.

The design of the solution contains two implementations, a simple one to **reach the deadline of April 1st** and a more advanced one for later. Both are described below.

## Sophisticated solution

The idea is as follows: The DDDC community decides, and the `DDDC admin` implements in the form of a JSON following the [ATLS schema](./atlas.md) available at their `$API-Graphql_endpoint` 
(see [example graphql api](https://betadddc.alabs.org/api/graphiql?query=%7B%0A%20%20petition(id%3A%201)%20%7B%0A%20%20%20%20id%2C%0A%20%20%20%20title%2C%0A%20%20%20%20description%2C%0A%20%20%20%20credential_issuer_api_url%2C%0A%20%20%20%20petitions_api_url%2C%0A%20%20%20%20attribute_id%0A%20%20%20%20json_schema%2C%0A%20%20%20%20%0A%20%20%7D%0A%7D)), on what attributes are needed to obtain a credential (see CREDENTIAL ISSUER NOTES) but also on the extra fields available and their respective bins. We shall call those values `$authorizable_attribute_info_optional`, which have the form:
```json
{
 $authorizable_attribute_info_optional: [
 	{
 		$attribute_info_key: 'gender',
    $attribute_info_type: 'string',
    $attribute_info_set: ['male','female']
    $attribute_info_k: 3,
},
 	{
 		$attribute_info_key: 'age',
    $attribute_info_type: 'integer',
    $attribute_info_set: ['0-18','18-25','25-45','>45'],
    $attribute_info_k: 3,
	},
 	{
 		$attribute_info_key: 'district',
    $attribute_info_type: 'str',
    $attribute_info_set: ['sant marti','gracia','...'],
    $attribute_info_k: 3,
	}, ...

}
```

Then, the DDDC hashes the `$attribute_info_bins` and sets up the `CREDENTIAL ISSUER API` in the very same way described in 
[CREDENTIAL ISSUING NOTES](./credentials.md) but passing the extra parameters just defined in the set-up step.

This information will be available (hashed), including the `$attribute_info_set` on the public endpoint `$credential_ïssuer_endpoint_address/{$petition_id}`.

The `DECODE APP` will be able to extract the un-hashed optional fields from the JSON schema exposed by DDDC, and will be able to hash them and send the `$authorizable_attribute_info_optional` actual user values at the time of asking for the credential, as discussed in the notes. At this point, the `CREDENTIAL ISSUER API` will execute the usual flow, but will store in a database the counters corresponding to each of the `$authorizable_attribute_info_optional`, updating them as more credentials are asked for.

Finally, the `CREDENTIAL ISSUER API` will expose the aggregated counts, on a public endpoint `$credential_ïssuer_endpoint_address/{$petition_id}/optional` applying the security measures that we decide. For the pilot, a simple *k-anonimity* schema: If a bin (counter) has less than `k` values, then it will not be shown.


This solution separates knowledge from the `CI-API`from the actual values. Obviously, if the  `CI-API` knows how to retrieve data from the `DDDC` graphql endpoint, the hashing is useless, but this can be enhanced with a layer of security added to the api. 


## Simple solution

The simple solution is very much the same as the sophisticated one, but without hashing the values at all. Thus, the `DECODE APP` can query directly the endpoints `$credential_ïssuer_endpoint_address/{$petition_id}` for the available info of the bins.


## Threat analysis (only for sophisticated solution)

> *The Credential Issuer is compromised, then it knows info about who participates in which petition*

This is the same as in regular processes, in elections the government knows who participated at individual level. So there is no effective solution to that. In our system, at least, getting this info is much more complicated.

> *With few participation, risk of identification is high*

To avoid this, we could use [differencial privacy techniques](https://en.wikipedia.org/wiki/Differential_privacy) on the exposure of the public endpoint of the `CI-API`. For the time being, we apply a simple [k-anonymity schema](https://en.wikipedia.org/wiki/K-anonymity).



-------

# Credits

Written by Oleguer Sagarra <ula@dribia.com> and Xavier Clotet <xavier@dribia.com>
