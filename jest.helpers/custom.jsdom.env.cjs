const { TestEnvironment } = require('jest-environment-jsdom');

module.exports = class CustomTestEnvironment extends TestEnvironment {
  constructor({ globalConfig, projectConfig }, context) {
    super(
      {
        globalConfig,
        projectConfig: Object.assign({}, projectConfig, {
          globals: Object.assign({}, projectConfig.globals, {
            Uint32Array: Uint32Array,
            Uint8Array: Uint8Array,
            ArrayBuffer: ArrayBuffer,
          }),
        }),
      },
      context
    );
  }

  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder, TextDecoder } = require('util');
      this.global.TextEncoder = TextEncoder;
      this.global.TextDecoder = TextDecoder;
    }
  }
};
