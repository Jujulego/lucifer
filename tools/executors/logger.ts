import { isCI } from 'ci-info';

// Logger
export const logger = {
  ...console,

  // Methods
  debug(message: any, ...args: any[]) {
    if (isCI) {
      message = '::debug::' + message;
    }

    console.debug(message, ...args);
  },

  warn(message: any, ...args: any[]) {
    if (isCI) {
      message = '::warning::' + message;
    }

    console.warn(message, ...args);
  },

  error(message: any, ...args: any[]) {
    if (isCI) {
      message = '::error::' + message;
    }

    console.error(message, ...args);
  }
}
