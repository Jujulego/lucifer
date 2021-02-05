import {
  getAddButton, getAddDescriptionField, getAddLoader,
  getAddNameField,
  getAddSlugField, getAddSubmitButton,
  getLoader,
  getProjectsTable
} from '../support/projects-table.po';
import { getDialog } from '../support/common.po';

// Test suites
describe('Projects table', () => {
  before(() => {
    cy.login();
    cy.visit(`/users/${Cypress.env('userId')}/projects`);
  });

  // Tests
  it('should show project table', () => {
    getLoader().should('not.exist');

    getProjectsTable().should('exist');
    getProjectsTable().findAllByRole('row').should('have.length', '3'); // 2 projects + 1 header
    getProjectsTable().findByText('Test #1').should('exist');
    getProjectsTable().findByText('Test #2').should('exist');
  });
});

describe('Add a new project', () => {
  before(() => {
    cy.login();
    cy.visit(`/users/${Cypress.env('userId')}/projects`);

    cy.intercept('POST', '**/api/*/projects').as('createProject');
  });

  afterEach(() => {
    cy.request({
      method: 'DELETE',
      url: `/api/${Cypress.env('userId')}/projects/cypress-test`,
      headers: {
        'Authorization': `Bearer ${Cypress.env('accessToken')}`,
      }
    });
  });

  // Steps
  it('should add a new project', () => {
    // Assert created project does not exist
    getLoader().should('not.exist');
    getProjectsTable().findByText('Cypress Test').should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getAddNameField().type('Cypress Test');
    getAddSlugField().should('have.value', 'cypress-test');
    getAddDescriptionField().type('This is a cypress test generated project');

    // Submit form
    getAddSubmitButton().click();
    getAddLoader().should('exist');

    // Await creation
    cy.wait('@createProject');
    getDialog().should('not.exist');
    getProjectsTable().findByText('Cypress Test').should('exist');
  });
});
