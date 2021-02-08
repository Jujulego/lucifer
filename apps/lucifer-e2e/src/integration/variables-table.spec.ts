import { getLoader, getVariableRow, getVariablesTable } from '../support/variables-table.po';

// Constants
const prjID = 'test-1';

// Init
beforeEach(() => {
  cy.login();
  cy.visit(`/projects/${Cypress.env('userId')}/${prjID}/variables`);

  // APIs
  cy.intercept('GET', `**/api/*/projects/${prjID}/variables`).as('getVariables');
});

// Test suites
describe('Variables table', () => {
  // Tests
  it('should show variable table', () => {
    cy.wait('@getVariables');
    getLoader().should('not.exist');

    getVariablesTable().should('exist');
    getVariablesTable().findAllByRole('row').should('have.length', '3');
    getVariablesTable().findByText('TEST_1').should('exist');
    getVariablesTable().findByText('TEST_2').should('exist');
  });
});
