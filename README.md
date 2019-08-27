## Table of contents
- [The DECODE App](#the-decode-app)
- [Directory structure](#directory-structure)
- [Starting a development environment](#starting-a-development-environment)
- [Available scripts](#available-scripts)
- [Attributes and applications](#attributes-and-applications)
- [Implementation notes](#implementation-notes)

## The DECODE App
This app provides a platform where people can control their personal data, choosing where and how to share it. It allows users to input their data and keep it saved on their phone for future use. It is part of the [DECODE project](https://decodeproject.eu)

The DECODE App is developed in React Native, with the following side technologies:

- Redux for state management
- Reselect for cacheable (memoized) access to the state
- Redux Thunk for asynchronous action dispatching
- Redux Persist for saving state to permanent storage
- AsyncStorage from React Native Community for native key-value permanent storage
- Plain Fetch API for communication with services
- React Navigation for navigation between screens and menus
- React Native Vector Icons as icon library set
- Styled Components for styling and theming
- Ramda for utilities
- moment for date & time handling
- react-i18next for multilanguage
- react-native-sentry for sending crash logs (requires a Sentry server)
- react-native-splash-screen to maintain the splash screen while JS is loading
- react-native-onboarding-swiper for the app intro caroussel
- react-native-walkthrough-tooltip for the screen tooltips walkthrough
- react-native-camera for QR scanning
- react-native-date-picker as cross platform component for date selection
- react-native-render-html to support HTML coming from application description fields
- react-native-loading-spinner-overlay as loading indicator

Development dependencies:
- yarn for dependency management
- babel for code transpiling
- eslint for code style
- jest for unit testing
- fastlane for store deployment automation


## Directory structure

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

UI Components are developed following the stateless functional component approach. Each component is a pure function returning something to render based solely on its received props.
Each component is spread over 3 files:
- A Component file with the presentational features
- A Container file with the connection to the Redux store
- A Styles file with the CSS information

## Starting a development environment

You need to have git and yarn installed.
You will also need XCode and Android Studio. 

Clone the project and `yarn install`. After that you can follow to the next section.

You need to have a .env file with configuration data that must be kept out of the source code like the encryption key. Use the .env.sample file as a guide. 

If you want to deploy to the test stores using fastlane, which is the recommended way, you need Ruby. Use `rbenv` to install the Ruby version specified in .ruby-version.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Starts the Metro bundler to serve the Javascript code in the development environment.

### `yarn run-ios`

Compile a native iOS app, start an iOS emulator and deploy the app. The Javascript code will be served by the Metro bundler.

### `yarn run-android`

Compile a native Android app, and deploy it to an emulator or a physical phone connected via USB. The Javascript code will be served by the Metro bundler.

### `yarn test`

This script does actually two things:
- First it executes the ESLint linter to ensure the code follows the configured rules.
- If there are no linting errors, it executes the tests with the jest test runner.

### `cd ios && bundle exec fastlane beta`

Deploys the app to the Apple Store as a new build downloadable with the TestFlight testing tool.

### `cd android && bundle exec fastlane beta`

Deploys the app to the Google Play store, to an internal test track.

## Attributes and applications

Attributes (names, types, conversion functions) and applications (description, link, image, shared attributes) are conteptually defined in an artifact we call the Atlas. They can be retrieved using the listAttributes() and listApplications() functions of atlas-client.
As a first basic implementation, a simple atlas.json file serves as the main repository for the Atlas.
It contains 3 objects: attributes, applications and translations.
Every translatable data item in both attributes and applications is a key into the translations object.

### Applications
Applications is an aggregate object with an application object for every supported application, indexed by its name. Among the data belonging to an application there is a list of the attributes that a user can share when using it.

Applications add their own logic as reducers on the redux/modules/applications folder. They also can add their screens under the screens/applications folder.

### Attributes
Attributes can be defined directly or based on an existing attribute.

For instance, the 'age' attribute is based on the 'birthDate'. A given applcation can share the 'age' attribute, but a user will just enter her birth date. A different application could share an age range instead, and that would be a different derived attribute, based on the same birthDate attribute.

New derived attributes require a 'converter' module exporting a default function accepting the base attribute as its first argument, and other configuration arguments.
Converter modules are kept in the redux/converters folder.

For instance, the age attribute uses the age converter, which calculates the age based on the birth date. No other arguments are required.

On the other hand, the ageRange attribute still uses the same birthDate base attribute, and a configuration object with an array of age ranges.

## Implementation notes

### Redux store structure
The store has the current state of the app.
It contains as less information as possible, normalized for efficient access.

The container components connect the store to the presentational components. It makes use of memoized selectors from the reselect library to retrieve data from the store and transform it to the shape that is more convenient to the presentational components.

### Persistence of the store
The store is persisted to permanent storage using Redux Persist and the AsyncStorage engine, which leaves the information in the following locations:
- iOS: The private Documents directory of the app
- Android: The private SQLite database of the app

Only strictly needed parts of the store are persisted by configuring blacklists in the persist config object.

The redux/migrations.js file contains the required migration operations every time a persisted data item changes its format. The current version is configured in redux/store.js. See Redux Persist documentation. 

### Encryption of sensitive data
Sensitive data is encrypted when saved to the store, and decrypted when retrieved, using functions in lib/utils.js.

AES with 128-bit key and CBC mode is used. The initialization vector is generated on every encrypt operation using UUID v4 and stored in front of the encrypted text. 

The encryption key is in a .env file outside of the source code, only accessible in a build environment.

### Splash screen
The splash screen has been developed following mostly [this awesome article by Spencer Carli](https://medium.com/handlebar-labs/how-to-add-a-splash-screen-to-a-react-native-app-ios-and-android-30a3cec835ae)

The color of the Android status bar during the JS loading stage has been set by hand to #777777 in colors.xml.

### Walkthrough 
A generic component WalktroughStep has been developed. It wraps the Tooltip component from the React Native Walkthrough Tooltip library, setting common props and simplifying its use.

The WalkthroughStep just needs to wrap the component over which the tooltip has to be shown, and it requires just 2 props: the id of the screen and the id of the tooltip.  

The order of the tooltips to be shown en each screen is specified as a const in the reducer. If a screen has multiple tooltips, they will be shown in that order. When the last tooltip has been shown, 'none' will be stored as the tooltip id and it will never match again, so it won't be shown again.

### Navigation
The navigation between screens is based on the React Navigation library. Its API is a little cumbersome so I explain here how it is organized.

The App.js entry point renders the RootScreen component, where all the navigators are defined.

RootScreen renders either the Carousel or the AppContainer, depending on the firstRun flag in the store.

The AppContainer wraps the RootNavigation, which displays either the Main screen or a Modal screen. This is for managing Modal interactions with the user.

The Main screen is a DrawerNavigator, which defines all the menu items accessible from the left header button.

Each screen in the drawer is a StackNavigator, with screens that can go either forwards via links in the screen, or backwards via the back button. Some stacks have a single screen so the only way to get out of them is via the menu. The first screen in a stack always has the menu button at the header top left, while the other screens have the back button.

### Initial Navigation
When the app is first started, the RootNavigator navigates to the ApplicationStack, and then to the ApplicationList.

The ApplicationList is the equivalent to the Home page in a web application. For this reason it has a couple of extra features to handle deep linking to specific screens from other apps:

- An Effect hook that gets the Initial URL from the React Native Linking component, and navigates to the application initial screen. This covers the case when the application **is started from a decodeapp:// link** in a mobile browser, or when the QR code is scanned using the phone camera.
- The hook also registers an event listener, and returns a function to deregister it as required by the React hooks specification.
- The event listener will fire every time **a decodeapp:// link is followed while the app is open**, and it will reset the navigation from wherever it was to the ApplicationStack and to the first screen of the application found in the URL.
 
### Theme and common styles
The lib/theme.js file contain common style variables as a centralized place for declaring colors, sizes, fonts, etc

The lib/styles.js file contains common styles, based on the theme variables, that are reused in any part of the app, perhaps slightly modified. Examples of styles are Heading or Screen (so that every screen uses the same heading style or layout)

The default font is the Montserrat Google Font. It has been downloaded in its Regular and Bold weights, and included under different file names depending on the OS, so that using fontFamily and fontWeight in the code works the same in both platforms