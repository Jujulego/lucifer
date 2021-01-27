import { getMachineTable } from '../support/machines.po';

before(() => {
  cy.login();
});

describe('Machines table', () => {
  before(() => {
    cy.visit(`/users/${Cypress.env('userId')}/machines`);
  });

  it('should show machine table', () => {
    getMachineTable().should('exist');
  });
});
