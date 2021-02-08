import { getDialog } from '../support/common.po';
import { getConfirmCancelButton, getConfirmConfirmButton, getConfirmList } from '../support/confirm.po';
import {
  getAddButton, getAddCloseButton, getAddDescriptionField, getAddLoader,
  getAddNameField,
  getAddSlugField, getAddSubmitButton, getDeleteButton,
  getProjectRow,
  getProjectsTable
} from '../support/projects-table.po';

beforeEach(() => {
  cy.login();
  cy.visit(`/users/${Cypress.env('userId')}/projects`);

  cy.intercept('GET', '**/api/*/projects').as('getProjects');
  cy.intercept('POST', '**/api/*/projects').as('createProject');
  cy.intercept('DELETE', '**/api/*/projects?*').as('deleteProjects');
});

// Test suites
describe('Projects table', () => {
  // Tests
  it('should show project table', () => {
    cy.wait('@getProjects');

    getProjectsTable().should('exist');
    getProjectsTable().findAllByRole('row').should('have.length', '3'); // 2 projects + 1 header
    getProjectsTable().findByText('Test #1').should('exist');
    getProjectsTable().findByText('Test #2').should('exist');
  });
});

describe('Add a new project', () => {
  const prjId = 'cypress-add-project-test';
  const prjName = 'Cypress Add Project Test';

  afterEach(() => {
    // Remove created project
    cy.request({
      method: 'DELETE',
      url: `/api/${Cypress.env('userId')}/projects/${prjId}`,
      headers: {
        'Authorization': `Bearer ${Cypress.env('accessToken')}`,
      }
    });
  });

  // Tests
  it('should add a new project', () => {
    // Assert project does not exist
    cy.wait('@getProjects');
    getProjectsTable().findByText(prjName).should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getAddNameField().type(prjName);
    getAddSlugField().should('have.value', prjId);
    getAddDescriptionField().type('This is a cypress test generated project');

    // Submit form
    getAddSubmitButton().click();
    getAddLoader().should('exist');

    // Await creation
    cy.wait('@createProject');
    getDialog().should('not.exist');
    getProjectsTable().findByText(prjName).should('exist');
  });

  it('should close created dialog without creating project', () => {
    // Assert project does not exist
    cy.wait('@getProjects');
    getProjectsTable().findByText(prjName).should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getAddNameField().type(prjName);
    getAddDescriptionField().type('This is a cypress test generated project');

    // Close dialog
    getAddCloseButton().click();
    getDialog().should('not.exist');
    getProjectsTable().findByText(prjName).should('not.exist');

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
    getProjectsTable().findByText(prjName).should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getAddNameField().type(prjName);
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
        message: `Project with id ${prjId} already exists`
      });
    }).as('createProject');

    // Assert project does not exist
    cy.wait('@getProjects');
    getProjectsTable().findByText(prjName).should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getAddNameField().type(prjName);

    // Submit and check for errors
    getAddSubmitButton().click();
    cy.wait('@createProject');

    getAddSlugField()
      .parent().parent()
      .findByText(`Project with id ${prjId} already exists`).should('exist');
  });
});

describe('Delete a project', () => {
  const prjId = 'cypress-delete-project-test';
  const prjName = 'Cypress Delete Project Test';

  beforeEach(() => {
    // Create a project to delete
    cy.request({
      method: 'POST',
      url: `/api/${Cypress.env('userId')}/projects/`,
      body: {
        id: prjId,
        name: prjName
      },
      headers: {
        'Authorization': `Bearer ${Cypress.env('accessToken')}`,
      }
    });

    cy.reload();
  });

  afterEach(() => {
    // Remove created project
    cy.request({
      method: 'DELETE',
      url: `/api/${Cypress.env('userId')}/projects/${prjId}`,
      headers: {
        'Authorization': `Bearer ${Cypress.env('accessToken')}`,
      }
    });
  });

  // Tests
  it('should delete a project', () => {
    // Assert project does exist
    cy.wait('@getProjects');
    getProjectRow(prjName).should('exist');

    // Select project
    getProjectRow(prjName).findByRole('checkbox').click();
    getDeleteButton().click();

    // Confirm should contain list of selected projects
    getConfirmList().findByRole('listitem')
      .should('contain.text', prjName)
      .and('contain.text', prjId);

    // Confirm
    getConfirmConfirmButton().click();

    // Assert project dont exist
    cy.wait('@deleteProjects');
    getProjectsTable().findByText(prjName).should('not.exist');
  });

  it('should cancel and do not delete', () => {
    // Assert project does exist
    cy.wait('@getProjects');
    getProjectRow(prjName).should('exist');

    // Select project
    getProjectRow(prjName).findByRole('checkbox').click();
    getDeleteButton().click();

    // Confirm should contain list of selected projects
    getConfirmList().findByRole('listitem')
      .should('contain.text', prjName)
      .and('contain.text', prjId);

    // Confirm
    getConfirmCancelButton().click();

    // Assert project dont exist
    getProjectsTable().findByText(prjName).should('exist');
  });
});
