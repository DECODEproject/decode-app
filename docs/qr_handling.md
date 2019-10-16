# DECODE QR and URL handling

The DECODE App is putting a lot of effort on stadardizing many of its elements, among the most prominent the data concepts encoded in the [Atlas reference](https://github.com/DECODEproject/decodev2/blob/master/src/api/atlas/atlas.json).

For the first production ready version of the app, one last standarization effort needs to be undertaken, that of unifying the existing handles to trigger the App.

Currently the app is triggered in two ways:

- *Mobile navigation*: Via the handle ```decodeapp://...```
- *QR scan*: Via the QR that encodes the above handle.

Out of the three implemented services, all use different parameters on their calls. 
Here we add a proposal to unify any service acting under the DECODE ecosystem.

In this document **we assume** that the service that wants to integrate with DECODE has **at least** one API that accepts *GET* requests to obtain information based on some kind of ```$service_id```.

## Handle syntax

The handle will stay as it is: ```decodeapp://action&service=service_name?param1=value1&param2=value2...```

### Action

The action field **must be defined in the Atlas** and specifies the type of action being triggered. For each new service, new actions can be defined. For the moment, we have 3 different actions:

- ```$support```: Triggers the support flow for DDDC
- ```$login```: Triggers the log-in of BCNNOW
- ```$declareSensor```: Triggers the IOT sensor declaration flow

The reason to define actions is that this allows greater modularity and re-usability of components (the most patent example being the log-in action).

Because we want to reuse actions, also on the handle the service name must be declared, and it **also must be defined on the Atlas**. For the moment, the recognized services are:

- ```$bcnnow```
- ```$dddc```
- ```$iot```


### Parameters

There are two types of parameters, one being optional and the other compulsory. Note that the parameters related to credentials are compulsory, because if you are not using them, you should reconsider the use of your system in the DECODE ecosystem.

Compulsory params:
 - ```$serviceId```: ID that identifies the object of the action (for log-in is the session id, for support its the petition id and for declare_sensor the sensor id).

Optional params:
 - Additional parameters can be added to the call. Those parameters are NOT free, and should be defined prior in the ATLAS. See the `applications.<applicationId>.urlScheme` keys in the [Atlas reference](https://github.com/DECODEproject/decodev2/blob/master/src/api/atlas/atlas.json).
   - Support: 
     - ```$decidimAPIUrl``` gives the URL of the back-end service API that supports this decidim version.
     - ```$authorizableAttributeId```: The credential ID that identifies the needed credential in the Credential Issuer service.
     - ```$credentialIssuerEndpointAddress```: gives the URL of the Credential Issuer service API.
   - Log-in: 
     - ```$callback``` gives the callback trigger once succesfull authorization has been performed.     

### Examples

The examples of the calls for the different services are shown below:

- Support: ```decodeapp://support?&decidimAPIUrl=https://dddc.decodeproject.eu/api/&serviceId=2&credentialIssuerEndpointAddress=http://credentials.decodeproject.eu/&authorizableAttributeId=2```
- Log in: ```decodeapp://login?&serviceId=cad57a42d5fa11e9b12a005056833c52&callback=http://bcnnow.decodeproject.eu:9530/oauth/iot_login_callback```

## Credits

Design done and written by:

- Oleguer Sagarra "Ula" <ula@dribia.com>
- Xavier Clotet <xavier@dribia.com>

In the context of the DECODE project.
