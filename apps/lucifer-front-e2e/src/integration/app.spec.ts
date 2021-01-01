import { getGreeting } from '../support/app.po';

describe('home', () => {
  before(() => {
    cy.login();
    cy.visit('/');
  });

  it('should be successfully logged in', () => {
    getGreeting().contains('Bonjour !');
  });
});
