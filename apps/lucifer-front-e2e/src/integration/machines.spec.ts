import { getMachineTable } from '../support/machines.po';

describe('machines', () => {
  before(() => {
    cy.login();
  });

  it('should show machine table', () => {
    cy.visit(`/users/${Cypress.env('userId')}/machines`);
    getMachineTable();
  });
});
