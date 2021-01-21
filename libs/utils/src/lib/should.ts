import { HttpStatus } from '@nestjs/common';
import { HTTP_CODES } from './http';

// Matchers logic
class All implements jest.AsymmetricMatcher {
  // Constructor
  constructor(private matchers: jest.AsymmetricMatcher[]) {}

  // Methods
  asymmetricMatch(other: unknown): boolean {
    let res = true;
    let i = 0;

    while (res && i < this.matchers.length) {
      res = res && this.matchers[i].asymmetricMatch(other);
      ++i;
    }

    return res;
  }
}

class Any implements jest.AsymmetricMatcher {
  // Constructor
  constructor(private matchers: jest.AsymmetricMatcher[]) {}

  // Methods
  asymmetricMatch(other: unknown): boolean {
    let res = false;
    let i = 0;

    while (!res && i < this.matchers.length) {
      res = res || this.matchers[i].asymmetricMatch(other);
      ++i;
    }

    return res;
  }
}

// Namespace
export const should = {
  // Logic
  all: (...matchers: jest.AsymmetricMatcher[]): All => new All(matchers),
  any: (...matchers: jest.AsymmetricMatcher[]): Any => new Any(matchers),

  // Schemas
  be: {
    httpError: (status: HttpStatus | number, error: string | string[], message?: string | string[]) => ({
      statusCode: status,
      error: message ? error : HTTP_CODES[status],
      message: message || error
    }),

    badRequest(...message: string[]) { return this.httpError(400, expect.arrayContaining(message)) }
  },
};
