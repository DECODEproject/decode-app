module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jest/globals": true
  },
  "extends": "airbnb",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly",
    "it": "readonly",
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "jest"
  ],
  "rules": {
    'react/jsx-filename-extension': 0,
    'react/forbid-prop-types': 0,
    'import/prefer-default-export': 0,
    'new-cap': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        'devDependencies': true,
      }
    ],
    'object-curly-newline': [
      'error',
      {
        'consistent': true,
        'multiline': true,
        "minProperties": 12,
      }
    ],
    'curly': ["error", "multi"],
  },
  "settings": {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
