# IOT Flow

## Preliminaries and references

* This flow builds upon the the contracts explained and coded in the [IOT-Contracts](https://github.com/DECODEproject/iot-pilot-contracts) repo.

## Actors and schematic flow

### Actors

* Credential Issuer (`CI`) - Entity that emits signed credentials that allow citizens to configure their IoT devices to share data with others participating in the DECODE ecosystem. It controls the [Credential Issuer API](https://github.com/DECODEproject/dddc-credential-issuer) already developed and explained in [CREDENTIAL ISSUING NOTES](https://pad.dyne.org/code/#/2/code/edit/qA7Pf4d+sQYBP2MqYgOU0isN/).
* Administrator (`CA`) - Entity that works with community groups in order to define policies that control how participating citizen's device data should be processed and encrypted. This entity is responsible for making various calls to API endpoints to create new communities
* Dashboard (Verifier) (`VE`)- The dashboard being operated by Eurecat is an entity that provides a dashboard that allows verified users to view data collected for a community. In reference to the Coconut authentication protocol this entity must be able to verify a blind credential provided by a Citizen and be able to grant or deny access to private resources based on this verification.
* Citizen (`CIT`) - a citizen taking part in the IoT pilot for DECODE, who has installed the `Decode App` and will receive an IoT device and take part in the workshops.
* Iot Device Manager (`IOT-DM`) - An entity who manages the underlying infrastructure to which the distributed IoT devices connect and submit data. In addition they manage user onboarding via an existing onboarding application which is the point of entry for a citizen (`CIT`) to become part of the DECODE IoT pilot. Finally this entity also currently is responsible for providing the infrastructure on which the server components for the IoT pilot are running.

### Components

* `POLICYSTORE` - server running on infrastructure managed by `IOT-DM`. Provides read/write API for community policy definitions. Makes calls to the `DASHBOARD` to register new community dashboards on creation
* `ENCODER` - server running on infrastructure managed by `IOT-DM` that is able to subscribe to the MQTT broker operated by `IOT-DM` and create encrypted streams of data which are then written to the `DATASTORE`
* `DATASTORE` - server that provides a data storage layer for encrypted events emitted by the `ENCODER` that runs on infrastructure managed by `IOT-DM`.
* `DASHBOARD` - service operated by the `VE` that stores decrypted events read from the `DATASTORE`, and is able to participate in the Coconut authentication flow to grant or deny access to private dashboards to citizens that are able to present a valid blind credential.
* `CREDENTIAL_ISSUER` - service that is required for generating credentials and then verifying them.
* `ONBOARDING_APP` - a service created by the `IOT-DM` that allows users to configure their physical device to connect to their home network and collects information from the user on the location and exposure of the device.

### IOT Pilot flows

1. Community creation - the setup and registration of available communities by the `CA`

2. Device onboarding - new citizens (`CIT`) adding the devices to DECODE, and initializing their `Decode App` with the details of these devices

3. Data collection - citizens choose communities to belong to which starts data being collected in encrypted form for that community

4. User authentication - citizen uses Coconut to securely prove their right to access a community


## Detailed flow mapped to the APIs used in the pilot

### 1. Community set-up

1. `CA` works with a community group in order to define a policy for the community containing a set of operations that the community wishes to apply to participating devices.
1. `CA` executes the setup steps defined in the [CREDENTIAL ISSUING NOTES](https://pad.dyne.org/code/#/2/code/edit/qA7Pf4d+sQYBP2MqYgOU0isN/) to create a new `AUTHORIZABLE ATTRIBUTE` for which credentials can be created. This call provides the `CA` with an `$authorizable_attribute_id` and `$credential_issuer_endpoint_url`.
2. `CA` creates a `$community_creation_request` including a `$community_definition` along with the obtained `$authorizable_attribute_id` and `$credential_issuer_endpoint_url`.
3. `CA` sends this `$community_creation_request` via a POST request to the [`$policystore_create_community` endpoint]( https://decodeproject.github.io/iot-policystore-docs/#tag/Create-Policy).
4. The `POLICYSTORE` sends a POST request to the [`$dashboard_api_create_encrypted_dashboard` endpoint](https://decodeproject.github.io/bcnnow-dashboard-docs/#tag/Create-Encrypted) which causes the `DASHBOARD` service to create a new dashboard with associated keypair, and returns the `$community_public_key` to the `POLICYSTORE`.
5. The `POLICYSTORE` saves this information after which point the community has been created and is ready for citizens to participate in.

### 2. Device onboarding

1. `CIT` is guided to install the `Decode App` during the course of a workshop.
2. `CIT` uses the `ONBOARDING_APP` in order to configure their physical device and supplies some information on the location and exposure of the device.
3. `ONBOARDING_APP` shows a page which allows the `CIT` to add their device to DECODE. This page shows a QR code (with corresponding short form URL) which encodes the following properties: `$device_token`, `$device_location`, and `$device_exposure`

4. `CIT` uses their `Decode App` to scan the QR code (or manually enters the URL in their browser), which captures this information into the `Decode App`.
5. The `Decode App` presents a UI to the user which is the mechanism by which they will be able to add their device to DECODE.
6. The `Decode App` sends a POST request to the [`$policystore_list_policies` endpoint](https://decodeproject.github.io/iot-policystore-docs/#tag/List-Policies) which returns a list of all available community policies.
7. The `Decode App` presents a UI which shows this list of available community policies.

8. `CIT` chooses which community they wish to join, so then the `Decode App` executes the credential issuing steps defined in the [Credential Issuing document](https://pad.dyne.org/code/#/2/code/edit/qA7Pf4d+sQYBP2MqYgOU0isN/) to create a blind credential for the specified `$authorizable_attribute_id`.
9. The `Decode App` then sends a POST request to the [`$encoder_create_stream` endpoint](https://decodeproject.github.io/iot-encoder-docs/#tag/Create-Stream) which creates a new stream for the specified device. This new stream causes encrypted data to be written to the encrypted datastore via the [`$encrypted_datastore_write` endpoint](https://decodeproject.github.io/iot-datastore-docs/#tag/Write-Events)

### 3. Data collection

1. The `DASHBOARD` is able to start requesting encrypted events as soon as a new dashboard has been registered by sending a POST request to the [`$read_encrypted_events` endpoint](https://decodeproject.github.io/iot-datastore-docs/#tag/Read-Events) on the `DATASTORE`.
2. This endpoint will initially return no events, but as soon as a `CIT` has chosen to add their device to a community, then encrypted events will start to appear in this dataset.
3. The `DASHBOARD` will use Zenroom to decrypt the events as they have the corresponding private key for the community, and these unencrypted events will be stored in the `DASHBOARD's` time series datastore

### 4. User authentication

1. A `CIT` wishes to view the communities dataset via the `DASHBOARD`, so they open the `DASHBOARD` url and attempt to open the specified dashboard.

2. The `DASHBOARD` knows the requested dashboard is protected so rather than showing to the `CIT` it instead presents a login page containing a QR code (and a short form URL). This QR code encodes a login link which the wallet must be able to scan to initiate the Coconut blind credential login flow.

  The link the dashboard should send to is: https://iot.decodeproject.eu/#/login?sessionId=abc123&callback=http://93ff8837.ngrok.io/oauth/iot_login_callback

  See the [QR handling notes](./qr_handling.md) for reference.


3. The `Decode App` after scanning the code (or entering the short form) displays a UI which prompts the user as to whether they wish to share their blind proof for the community with the dashboard. If the user agrees, the app creates a `$login_request` containing their blind proof as well as some additional metadata back to the `DASHBOARD's` login URL (TODO: document this method)


4. The `DASHBOARD` parses the incoming `$login_request`, and then sends a request to the `$credential_issuer_endpoint_address` to obtain a public verification key for the specified `$authorizable_attribute_id`. 

5. The `DASHBOARD` then executes the Coconut script to verify the blind credential, and if the credential _is_ valid, creates a new session for the `CIT`, i.e. logging them into the requested dashboard, and then redirects the user to that page.

## Credits

Written by Sam Mulube <sam@thingful.net> with minor revisions from Oleguer Sagarra <ula@dribia.com>