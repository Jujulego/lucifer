import {
  getAddButton, getAddCloseButton, getAddDescriptionField, getAddLoader,
  getAddNameField,
  getAddSlugField, getAddSubmitButton,
  getLoader,
  getProjectsTable
} from '../support/projects-table.po';
import { getDialog } from '../support/common.po';

beforeEach(() => {
  cy.login();
  cy.visit(`/users/${Cypress.env('userId')}/projects`);

  cy.intercept('GET', '**/api/*/projects').as('getProjects');
  cy.intercept('POST', '**/api/*/projects').as('createProject');
});

// Test suites
describe('Projects table', () => {
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
  beforeEach(() => {
    // Remove created project
    cy.request({
      method: 'DELETE',
      url: `/api/${Cypress.env('userId')}/projects/cypress-test`,
      headers: {
        'Authorization': `Bearer ${Cypress.env('accessToken')}`,
      },
      failOnStatusCode: false
    });

    // Reload page
    cy.reload();
  });

  // Tests
  it('should add a new project', () => {
    // Assert project does not exist
    cy.wait('@getProjects');
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

  it('should close created dialog without creating project', () => {
    // Assert project does not exist
    cy.wait('@getProjects');
    getProjectsTable().findByText('Cypress Test').should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getAddNameField().type('Cypress Test');
    getAddDescriptionField().type('This is a cypress test generated project');

    // Close dialog
    getAddCloseButton().click();
    getDialog().should('not.exist');
    getProjectsTable().findByText('Cypress Test').should('not.exist');

    // Dialog form should be reset
    getAddButton().click();
    getAddNameField().should('have.value', '');
    getAddSlugField().should('have.value', '');
    getAddDescriptionField().should('have.value', '');
  });

  it('should show field errors', () => {
    // Prepare request interception
    cy.intercept('POST', '**/api/*/projects', (req) => {
      req.reply(400, {
        statusCode: 400,
        error: 'Bad Request',
        message: [
          { path: 'id', type: 'cypress', errors: ['cypress generated error on id'] },
          { path: 'name', type: 'cypress', errors: ['cypress generated error on name'] },
          { path: 'description', type: 'cypress', errors: ['cypress generated error on description'] },
        ]
      });
    }).as('createProject');

    // Assert project does not exist
    cy.wait('@getProjects');
    getProjectsTable().findByText('Cypress Test').should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getAddNameField().type('Cypress Test');
    getAddDescriptionField().type('This is a cypress test generated project');

    // Submit and check for errors
    getAddSubmitButton().click();
    cy.wait('@createProject');

    getAddSlugField()
      .parent().parent()
      .findByText('cypress generated error on id').should('exist');
    getAddNameField()
      .parent().parent()
      .findByText('cypress generated error on name').should('exist');
    getAddDescriptionField()
      .parent().parent()
      .findByText('cypress generated error on description').should('exist');
  });

  it('should show conflict error', () => {
    // Prepare request interception
    cy.intercept('POST', '**/api/*/projects', (req) => {
      req.reply(409, {
        statusCode: 409,
        error: 'Conflict',
        message: 'Project with id cypress-test already exists'
      });
    }).as('createProject');

    // Assert project does not exist
    cy.wait('@getProjects');
    getProjectsTable().findByText('Cypress Test').should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getAddNameField().type('Cypress Test');

    // Submit and check for errors
    getAddSubmitButton().click();
    cy.wait('@createProject');

    getAddSlugField()
      .parent().parent()
      .findByText('Project with id cypress-test already exists').should('exist');
  });
});
