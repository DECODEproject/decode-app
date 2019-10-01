# Credential issuer logic (DDDC usecase)


> These are earlier notes of the DDDC flow, we keep them here for reference.

## Requirements

1. Coconut could have a unique_id attached to each credential.
2. The responsibility that the ids are unique lies entirely on the credential issuer owner.
3. The conditions for uniqueness, so, the link between the amount of information required from a person and the fact that this person is awarded a credential associated to a unique id lies also on the credential issuer. This is something every community running decidim should decide and agree. It is not up to us to restrict this.
4. The use of DNI as unique id is discarded for a couple of reasons:
  1. Most communities using DECIDIM, likely to use our signature support software, do not use DNI and are against it, and even do not have one.
  2. DNI poses a security thread as anything marked with this becomes personal data by virtue of the GDPR, as DNI is a unique and untransferable personal identifier.



## Logic

The logic contains two parts. One is the UNIQUE_ID generation. The other is the COCONUT credential generation. My suggestion:

> Notation commentary: Variables are reference like `$variable` and important elements with CAPS (like `CREDENTIAL ISSUER`).


** A. Credential logic set-up:**

1. DDDC admin creates a `PETITION` and defines the `ATTRIBUTES` that will require validation needed to participate in it identified by `$autorizable_attribute_id`. It assigns an `$dddc_petition_id` to the petition and also assigns a `$credential_issuer_endpoint_address` that point to the credential issuer API needed to validate it.
2. DDDC admin also defines the set of `$autorizable_attribute_info` (see below) needed to award a `$autorizable_attribute_unique_id` and a `CREDENTIAL` that validates the `ATTRIBUTES` to anyone that requests it and fulfills the conditions to get it. This `$autorizable_attribute_info` can be a DNI, a token, a Name, whatever. It must be the set of information the community has agreed that uniquely serves to identify someone. 
> In our case, this is going to be a CODE/TOKEN provided to participants (all the same - represents the petition?) +  their email. The INFO field is a dictionary containing pairs {`$info_element_name`: `$info_element_type`}: The first is the name of the field to show, the second is the expected type (string, number, etc...). 
3. DDDC obtains in whichever way an `$credential_issuer_authorization_token` to communicate with the Credential-issuer API defined by the `$credential_issuer_endpoint_address`.
4. DDDC website makes a POST call, authorized via `$credential_issuer_authorization_token`, to CREATE a new `AUTORIZABLE_ATTRIBUTE` identified by `$autorizable_attribute_id`, which includes the compulsory fields `$autorizable_attribute_info`, which is dictionary with pairs `($attribute_info_key, $attribute_info_type)`.
5. Credential issuer API receives the POST, makes sure the authorization is valid, and creates an instance of `AVAILABLE_AUTORIZABLE_ATTRIBUTE` tied to the `$autorizable_attribute_id` and `$autorizable_attribute_info` fields, returns OK 200. The return call also includes a field called `$credential_issuer_name` to identify the credential-issuer.
6. DDDC adds to the JSON schema graph-ql that is used to communicate with the Wallet the `$dddc_petition_id`, `$credential_issuer_endpoint_address`, `$autorizable_attribute_id` and `$autorizable_attribute_info`.


**B. UNIQUE ID Generation:**
    
1. Wallet queries via GET the `DDDC GRAPHQL ENDPOINT API` to get `$credential_issuer_endpoint_address`, `$autorizable_attribute_id` and `autorizable_attribute_info` tied to `$dddc_petition_id`, which has been read from original petition encoded in QR code from DDDC website.
2. Wallet decodes the response of the GRAPHQL DDDC ENDPOINT and stores the info. 
3. When users wants to obtain the credential, the wallet presents a screen form to user with the elements of `$autorizable_attribute_info`, on behalf of `$credential_issuer_name`.
3. User inputs the information, presses "send" and the wallet executes a GET call to the  `$credential_issuer_endpoint_address` identified by `$autorizable_attribute_id` with the information input by the user in the body of the call `$autorizable_attribute_info`. To note, this call need not be authorized, just controlled for throttling.
4. Credential issuer API receives the GET call, parses information and executes a function 
```$validate_info_success = (boolean) validate_info((dictionary)$autorizable_attribute_info)``` that returns TRUE if the info is sufficient to be awarded a credential and false otherwise. If the function returns FALSE, the API returns a standard HTTP error to the wallet. Else, proceed.
5. If the result of the funciton call is TRUE, then it calls a deterministic HASH FUNCTION ```$autorizable_attribute_unique_id = (long str) hashing_function($autorizable_attribute_info)``` and returns it on the GET call. Then the coconut flow begins.  

> This function should be placed in `main.py` file once the [API](https://github.com/DECODEproject/dddc-credential-issuer) is finished. The signature call of the function should be: ```$validate_info_success = (boolean) validate_info((dictionary)$autorizable_attribute_info)```

> Or more, pythonic... 

```python
def validate_attribute_info(autorizable_attribute_info, dict_of_autorized_values):
    data = autorizable_attribute_in
    # do the magic, for the moment return TRUE no matter what, most likely it will be something like:
    if type(data) != dict:
          raise TypeError('Data passed has invalid type')
    bool_vals = []
    for k in compulsory_items:
        set_to_check = dict_of_autorized_values.get(k,set()) # dict_of_autorized_values is a dictionary of 'str':set() pairs
        bool_val = data.get(k,None) in set_to_check
        bool_vals.append(bool_val)
    return all(bool_vals)
```

Notes:
* Since the hash is deterministic, a person asking twice for a credential, will get the same credential, that the tally wil recognise as a duplicated signature.
* The hashing algorithm used must be public if one desires to have multiple credential issuers. As long as they are known to the community and their puclib keys accepted, this poses no security threat.
* The fact that the wallet keys are associated with a unique id and are generated every time on the wallet we run an attribute validation via credential means that we do not need to store them securely on the wallet once the credential has been obtained. (Is this right?).
* The validate_info function will be defined and written specially for the pilot for delivery. It mimics a "census check call" or "membership check call" to a  database by an organization.
 
**C. COCONUT flow (reference: https://github.com/DECODEproject/decidim-pilot-contracts)**
1. Wallet runs zencode script 01-CITIZEN-request-keypair.zencode and generates keys for wallet, and stores securely 
> Question : is the key storage really needed? are the keys gonna be used for anything else?.
2. Wallet runs 02-CITIZEN-request-blind-signature.zencode and send output to Credential issuer via GET call.
3. (Asynchronous) Credential issuer runs 03-CREDENTIAL_ISSUER-keypair.zencode once on startup and stores the keys securely.
4. (Asynchronous) Credential issuer must have a method endpoint to a GET call that exposes the public key, output of contract 04-CREDENTIAL_ISSUER-public-verify-keypair.zencode. This is needed for tallying and checkers.
5. Credential issuer on receiving request at point C.2. via GET, executes  05-CREDENTIAL_ISSUER-credential-blind-signature.zencode, receives the CREDENTIALs, packages it as a long string and returns with the response to the GET request.
6. Wallet executes 06-CITIZEN-credential-blind-signature.zencode with the input of the result of the GET request, and stores securely the credential.
7. Wallet executes 07-CITIZEN-blind-proof-credential.zencode and stores the proof that the credential is valid. It has to be ready to present this proof to anyone wishing the check its validity, which will need to use the exposed endpoint in step B.4 to do so. This will be needed for the contract signature support.



Author: Oleguer Sagarra (Dribia) <ula@dribia.com>
