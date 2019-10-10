# App structure

The DECODE app has a simple structure which is easy to follow. Overall, as stated in the [README](../README.md):

- android: Native Android source code and build folder
- ios: Native iOS source code and build folder
- src: JavaScript source code, having the following structure:
    - api: The clients for the external services and APIs
    - i18n: Configuration of the i18n library and language files
    - lib: Commonly used functions and constants
    - lib/components: Reusable presentational components
    - redux: The Redux store setup and the reducers
    - redux/modules: Reducers are organized in modules
    - redux/modules/applications: Applications add their reducers in this folder
    - redux/transformers: Functions for calculating derived attributes
    - screens: The UI components
    - screens/applications: The UI components for each application
    - App.js: The entry point, where the high level building blocks are combined
    - assets: Fonts and theme needs.

Below, we detail some of the folders and their use on the JavaScript part of the sourcecode, those which are needed to adapt the app to new services.

## API

This containts the client files to call external API of service that the app needs to operate. The core APIs implemented are those related to:

- Errors: Handlers for errors returned by external APIs.
- Atlas: Atlas client that contains the relations and elements that the app can understand. For the moment implemented as a plain JSON, but could be extended to be an external fully fledged ontological reference service. The atlas folder contains images and the JSON implementation, while the ```atlas-client.js``` abstracts the exploration of the ATLAS implementation.
- Zenroom: This containts the zenroom client to execute zenroom in the app (see [zenroom website](http://zenroom.org) for details). The folder [zenroom](../../src/api/zenroom) contains the cryptographic contracts that the app uses.
- Credential service: The credential issuer client handles the relations with the [credential issue api](https://github.com/DECODEproject/credential-issuer).
- Petitions service: Contains the client to interact with the blockchain based [petitions service API](https://github.com/DECODEproject/dddc-petition-api).
- Services: A variety of ```service.js``` files are declared to allow the app to interact with external service. In particular:
  - IOT: Contains files to communicate with the encoder, and policy store, service part of the [IOT pilot](./iot_flow.md).
  - DDDC: Contains client to interact with the [DECIDIM (DDDC) graphql service](https://docs.decidim.org/develop/en/modules/official/api/).
  - BCNNow: Contains a client to interact with the login flow.

## Lib

This contains 3 relevant files and one relevant folder:

- Components: Contains reusable components with self-explanatory names.
- ```theme.js``` and ```styles.js```: Configurable styles and themes file.
- ```url-scheme.js``` contains the parser for handles and QR codes. See [QR docs for details](./qr_handling.md). It also contains legacy code to parse earlier non-standard implementations.

## Redux
Following **standard react-native architecture**, it contains the current status of the app, storage and reducers (functions that modify the status of the app). It contains two relevant folders:

- converters: This contains the functions (standard javascript) that convert derived attributes from base attributes, see [app extension docs](./extending.md).
- modules: This contains the functions needed for the screens to work that interact with the storage. In particular, a further folder is located:
  - applications: It contains one file per service/application that defines the business logic followed by the screens.


## Screens

Contains the UI components of each application. This folder contains one folder per screen in the app (or per section). At this level the main sections are found, with an additional folder "applications" that contains screens triggered by the use of handles, which are particular to each service/application added to the DECODE ecosystem.

Each folder contain components (remember that reusable compoenents are in the [lib/components folder](../src/lib/Components)) and particular styles. Each screen components makes use of the relevant business logic defined in the redux folder.

