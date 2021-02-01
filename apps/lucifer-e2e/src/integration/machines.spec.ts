import { getLoader, getMachineTable } from '../support/machines.po';

before(() => {
  cy.login();
});

describe('Machines table', () => {
  before(() => {
    cy.visit(`/users/${Cypress.env('userId')}/machines`);
  });

  it('should show machine table', () => {
    getLoader().should('not.exist');

    getMachineTable().should('exist');
    getMachineTable().findAllByRole('row').should('have.length', '4');
    getMachineTable().findByText('Test #1').should('exist');
    getMachineTable().findByText('Test #2').should('exist');
    getMachineTable().findByText('Test #3').should('exist');
  });
});
