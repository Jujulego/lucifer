import { should } from './should';

// Constants
const asm: Record<'true' | 'false', jest.AsymmetricMatcher> = {
  true:  { asymmetricMatch: () => true  },
  false: { asymmetricMatch: () => false },
};

// Test suites
describe('should.all', () => {
  it('should return true if all matchers return true', () => {
    expect(should.all(asm.true, asm.true, asm.true).asymmetricMatch(null))
      .toBeTruthy();
  });

  it('should return false if one matcher return false', () => {
    expect(should.all(asm.true, asm.false, asm.true).asymmetricMatch(null))
      .toBeFalsy();
  });
});

describe('should.any', () => {
  it('should return true if one matcher return true', () => {
    expect(should.any(asm.true, asm.false, asm.false).asymmetricMatch(null))
      .toBeTruthy();
  });

  it('should return false if all matchers return false', () => {
    expect(should.any(asm.false, asm.false, asm.false).asymmetricMatch(null))
      .toBeFalsy();
  });
});

describe('should.be.httpError', () => {
  test('with error only', () => {
    expect(should.be.httpError(400, 'error'))
      .toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: 'error'
      });
  });

  test('with error and message', () => {
    expect(should.be.httpError(400, 'error', 'message'))
      .toEqual({
        statusCode: 400,
        error: 'error',
        message: 'message'
      });
  });
});

describe('should.be.badRequest', () => {
  test('with message', () => {
    expect(should.be.badRequest('error', 'message'))
      .toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: ['error', 'message']
      });
  });
});
