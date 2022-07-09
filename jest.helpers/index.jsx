const React = require('react');
require('regenerator-runtime/runtime');

process.env.NX_JEST_TESTING = 'true';

global.jQuery = require('jquery');
global._ = require('lodash');
global.ko = require('knockout');
global.$ = global.jQuery = require('jquery');

global.fetch = jest.fn((input) => ({
  then: jest.fn(() => Promise.resolve(jest.fn())),
}));

global.mockIsFunction = (arg) => {
  return {}.toString.call(arg) == '[object Function]';
};

jest.mock('@retsam/ko-react', () => ({
  useObservable: (arg) => (mockIsFunction(arg) ? arg() : arg),
}));

global.mockComponent = (componentName) => {
  return function MockComponent(_props) {
    return React.createElement('div', {
      'data-testid': componentName + '-component',
    });
  };
};

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length),
  },
});
global.crypto.subtle = {};

global._c = {
  si: process.env.NX_SITE_ID,
  fb: JSON.parse(process.env.NX_FIREBASE_CONFIG || '{}'),
  did: process.env.NX_FIREBASE_MEASUREMENT_ID,
  durl: process.env.NX_FIREBASE_URL,
  dbk: process.env.NX_FIREBASE_BUCKET,
  ad: process.env.NX_AUTH0_CUSTOM_DOMAIN || process.env.NX_AUTH0_DOMAIN || '',
  aa: process.env.NX_AUTH0_AUDIENCE,
  ac: process.env.NX_AUTH0_CLIENT_ID,
};

global.mockInterpret = (context, value = 'initial', nextEvents = []) => {
  return {
    getSnapshot: () => ({
      context,
      value,
      nextEvents,
      matches: (other) => {
        const foo = toPairs(stateValue);
        const flatState = isObject(stateValue)
          ? join([toPairs(stateValue)[0][0], toPairs(stateValue)[0][1]], '.')
          : stateValue;
        return other === flatState;
      },
      subscribe: (fn) => {
        return {
          unsubscribe: () => {},
        };
      },
    }),
    send: (event) => undefined,
    nextState: (event) => this.getSnapshot(),
    get state() {
      return this.getSnapshot();
    },
  };
};
