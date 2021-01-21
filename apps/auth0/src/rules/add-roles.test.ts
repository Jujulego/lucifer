import rewire = require('rewire');

const Rules = rewire('./add-roles');
const AddRoles = Rules.__get__<Rule>('AddRoles');

// Tests suites
describe('AddRoles', () => {
  // Constants
  const callback = jest.fn();
  const user: RuleUser = {};
  const ctx = {
    accessToken: {},
    idToken: {}
  } as RuleContext;

  // Tests
  it('should add roles to tokens', () => {
    AddRoles(user, { ...ctx, authorization: { roles: ['test'] } }, callback);

    expect(callback).toBeCalledWith(
      null, user,
      expect.objectContaining({
        accessToken: expect.objectContaining({
          'https://lucifer-front/roles': ['test'],
        }),
        idToken: expect.objectContaining({
          'https://lucifer-front/roles': ['test'],
        })
      }))
  });

  it('should add empty array as roles if authorization is missing', () => {
    AddRoles(user, { ...ctx, authorization: undefined }, callback);

    expect(callback).toBeCalledWith(
      null, user,
      expect.objectContaining({
        accessToken: expect.objectContaining({
          'https://lucifer-front/roles': [],
        }),
        idToken: expect.objectContaining({
          'https://lucifer-front/roles': [],
        })
      }))
  });
});
