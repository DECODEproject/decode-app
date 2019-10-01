# Dashboard request Login to DECODE App

> Those are old docs, now the docs in the repo have been updated.

## Open link (normal link or QR code):

`${schema}://login?sessionId=${sessionId}&callback=${callback}`

- Schema: Depends on the version of the app (production or expo) but if in production should be ‘decodeapp’
- SessionId: Session id to identify the user during the process of login, is the link to ensure that we enable the login of the correct user.
- Callback: Url in which the wallet will do the login request, which is described in next point.


> Example of url:

`decodeapp://login?sessionId=9876&callback=http://bcnnow.decodeproject.eu/wallet-login`


## User selects and accepts to share the credential

None of this part affects how the communication works between the app and the dashboard.

## App sends the authorization token

The app is gonna do a POST request with a json body to the callback argument that started the session with: 

- sessionId: The same that started the session
- credential: The attribute by which the user wants to be identified
- optionalAttributes: Other attributes the user wants to share


This is the structure of the JSON that will be sent in the request body::

```json
{
  "sessionId": String,
  "credential": Object {
	"authorizable_attribute_id": String,
	"credential_issuer_endpoint_address": URL,
	"value": Object {
        "h": String,
  	  "schema": String,
  	  "version": String,
  	  "s": String,
	}
  },
  "optionalAttributes": ArrayOfObject {
	"attribute_id": String,
	"value": String,
  }
}
```

This is an example of JSON payload:

```json
{
  "sessionId": "9876",
  "credential": {
	"authorizable_attribute_id": "schema:addressLocality",
	"credential_issuer_endpoint_address": "http://credential-issuer.decodeproject.eu/validate_attribute_info",
	"value": {
{
  "proof": {
    "schema": "coconut_theta",
    "sigma_prime": {
      "s_prime": "...",
      "h_prime": "..."
    },
    "pi_v": {
      "rm": "...",
      "rr": "...",
      "c": "..."
    },
    "version": "0.8.1",
    "nu": "...",
    "kappa": "..."
  }
}

},
  },
  "optionalAttributes": [
	{
  	"attribute_id": "schema:dateOfBirth",
  		"value": "04/07/1972",
	},
	{
  	"attribute_id": "schema:gender",
  		"value": "M",
	},
{
  	"attribute_id": "schema:district",
  		"value": "Something",
	},
  ],
}
```


After receiving the request, the dashboard should execute a zenroom script that validates if the credential was really sign by the authority and if so, login the user into the dashboard with the correct data. If everything is correct it will return a HTTP 200 status code. In case of an error it will return a meaningful [4xx error] (https://www.restapitutorial.com/httpstatuscodes.html) and a JSON body with the error detail:

```json
{
   "detail": "......"
} 
```

Examples of HTTP status codes are: 412 if a precondition fails, which would be the case if the input parameters contain incorrect data, 422 if the server does not understand the structure of the JSON request, or 408 if the client took too long to send the request, which would be the timeout case.
If the Entire process is not completed in 5 min the session will time out and the user need to refresh and rescan the QR code. 


# API specification for Admin setup


## Create Encrypted Community Data Source. (Called by Policy Store in IoT use case)

API: Post request : `http://84.88.76.45:887/community/create_encypted`
With Json Body

```json
{
  "community_name": "String",
  "community_id": "String",
  "authorizable_attribute_id": "String",
  "credential_issuer_endpoint_address": "URL"
}
```

Response Json:


```
{
	“id”:String
	“public_key”: String
}
```


## Create Non Encrypted Community Data Source. (Called by Policy Store in IoT use case)

API: Post request : `http://84.88.76.45:887/community/create`

With Json Body

```json
{
  "community_name": "String",
  "community_id": "String",
  "authorizable_attribute_id": "String",
  "credential_issuer_endpoint_address": "URL"
}
```

Response Json:

```json
{
	“id”:String
}
```

In both the above case of error it will be non 200 response with json 

```json
{
    "message": String
}
```



