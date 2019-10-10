# Atlas reference

This document is a reference to format the Atlas.

## Why the Atlas and what it is?

The Atlas is a proto-ontology used by the app where all the relevant elements of the DECODE universe are defined. 

This allows easy adaptation of new services, as well as simplifies the process of coding. Essentially the Atlas governs de types of data the app can understand and manage 
(both when using other applications and services and when handling credentials) as well as the relations among applications and those types of data (called attributes).

For more details, please refer to the [app extension document](./extending.md).

## Atlas current implementation

Currently the Atlas is implemented in a simple [JSON file](../src/api/atlas/atlas.json) that is queried via a client calls contained [in the client document](../src/api/atlas-client.js).
This implementation is intentional, since the JSON atlas could easily be replaced by a fully fledged API that contains a wider definition of specs and rules.

The current Atlas is a pure JSON file with the following structure attached.

------------

    ├── Attributes            <- Attributes definition: Can be of types enum, int, string, date, float, list or bins.
        ├── basic             <- Basic type
        └── derived           <- Derived type (information coarsening of a basic type). Needs the declaration of a converter function.
    ├── Applications          <- Applications definition: One entry per application with speciffic details such as URLS etc...
    └──Translations           <- Language speciffic translations: Currently supported ES, EN and CA
        ├── Attributes        
        └── Applications      

--------

All the operations relating to this structure are defined and managed at the relevant [redux file](src/redux/modules/attributes.js).


### Attributes
Attributes are easily defined, following the example below.

In this example, attributes of type "enum", "birthDate", "string", "number" and "range" are defined. Further types are for the moment not defined. 

The below fields are translated and refined in the "translation" section below.

```json
    "gender": {
      "name": "gender",
      "type": "enum",
      "description": "genderDesc",
      "values": ["female", "male", "other"]
    },
    "birthDate": {
      "name": "birthDate",
      "type": "date",
      "description": "birthDateDesc"
    },
    "address": {
      "name": "address",
      "type": "string",
      "description": "addressDesc",
      "hidden": true
    },
        "age": {
      "name": "age",
      "type": "number",
      "derivedFrom": "birthDate"
    },
    "ageRange": {
      "name": "ageRange",
      "type": "range",
      "derivedFrom": "birthDate",
      "config": {
        "ranges": [[0, 18], [18, 25], [25, 35], [35, 45], [45, 55], [55, 65], [65]]
      }
    }


```
Note how types `$age` and `$ageRange` are derived attributes, hence, they need definitions in the [converter folder](../src/redux/converters/) and a declaration from which they are derived.

## Applications

The definition of applications again is easy to follow.

```json
  "applications": {
    "dddc": {
      "urlScheme": {
        "action": "support",
        "serviceId": "petitionId",
        "params": ["decidimAPIUrl", "credentialIssuerEndpointAddress", "authorizableAttributeId"]
      },
      "id": "dddc",
      "name": "dddc.name",
      "title": "dddc.title",
      "image": "people",
      "link": "https://dddc.decodeproject.eu",
      "description": "dddc.desc",
      "sharedAttributes": ["gender", "age", "district"],
      "activationMsg": "dddc.activation",
      "actionMsg": "dddc.sign",
      "linksAfterSign": "dddc.links"
    },
```

Most of the fields are self-explanatory, for the rest we detail them below:

- The `$urlScheme` dictionary follows from the standard for [QR handling](../docs/qr_handling.md). 
- The `$image` corresponds to the name of the image located in [atlas folder](../src/api/atlas/images/).
- The `$sharedAttributes` list is the list of shared attributes that potentially this application can handle.
- The `$linksAfterSign` shows the connected applications to which this application is related, to be shown to user after an action is performed on the final screen.

The rest of elements correspond to display texts and actions used by the app, which can be easily followed from code in the Business logic part of the app ([screens](../srsc/screens/) and 
[redux](../src/redux/modules/) folders.



## Translations

In here simply all the texts are provided for the descriptions of the elements defined above. This descriptions are rendered by de app to support multilingual use.


## Credits

Written and designed by Xavier Clotet <xavier@dribia.com> and Oleguer Sagarra <ula@dribia.com>
