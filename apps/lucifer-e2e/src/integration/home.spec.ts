import { getGreeting, getRoles } from '../support/home.po';

describe('home', () => {
  before(() => {
    cy.login();
    cy.visit('/');
  });

  it('should be successfully logged in', () => {
    getGreeting().contains('Bonjour !');
  });

  it('should print user\'s roles', () => {
    getRoles().should('have.text', '');
  });
});
