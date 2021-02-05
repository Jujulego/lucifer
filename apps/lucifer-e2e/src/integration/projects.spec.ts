import { getLoader, getProjectsTable } from '../support/projects.po';

before(() => {
  cy.login();
});

describe('Machines table', () => {
  before(() => {
    cy.visit(`/users/${Cypress.env('userId')}/projects`);
  });

  it('should show machine table', () => {
    getLoader().should('not.exist');

    getProjectsTable().should('exist');
    getProjectsTable().findAllByRole('row').should('have.length', '3'); // 2 projects + 1 header
    getProjectsTable().findByText('Test #1').should('exist');
    getProjectsTable().findByText('Test #2').should('exist');
  });
});
