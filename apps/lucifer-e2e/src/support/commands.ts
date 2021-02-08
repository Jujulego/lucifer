import '@testing-library/cypress/add-commands';
import jwt from 'jsonwebtoken';

// Declarations
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject = any> {
      login(): void;
    }
  }
}

// Commands
Cypress.Commands.add('login', () => {
  // Credentials
  const username = Cypress.env('username');
  const password = Cypress.env('password');

  // Get a token
  cy.log(`Logging as ${username}`);

  cy.request({
    method: 'POST',
    url: `https://${Cypress.env('Auth0Domain')}/oauth/token`,
    body: {
      grant_type: 'password',
      username, password,
      scope: 'openid profile email',
      audience: Cypress.env('Auth0Audience'),
      client_id: Cypress.env('Auth0ClientId'),
      client_secret: Cypress.env('Auth0ClientSecret'),
    }
  })
    .then((res) => {
      const { access_token, expires_in, id_token } = res.body;

      // Store token in environment
      Cypress.env('accessToken', access_token);

      // Intercept Auth0 request and return our token
      cy.intercept('POST', 'oauth/token', {
        access_token,
        expires_in,
        id_token,
        token_type: 'Bearer'
      });

      return cy.window()
        .then((w) => {
          w.localStorage.setItem(
            `@@auth0spajs@@::${Cypress.env('Auth0ClientId')}::${Cypress.env('Auth0Audience')}::openid profile email`,
            JSON.stringify({
              body: {
                access_token, id_token,
                scope: 'openid profile email',
                expires_in,
                token_type: 'Bearer',
                decodedToken: {
                  claims: jwt.decode(id_token),
                  user: jwt.decode(access_token),
                },
                client_id: Cypress.env('Auth0ClientId'),
                audience: Cypress.env('Auth0Audience'),
              }
            })
          );
        });
    });
});
