import {
  getAddButton, getDeleteButton, getDialogLoader,
  getDialogNameField,
  getDialogSlugField, getDialogSubmitButton, getDialogValueField,
  getVariableRow,
  getVariablesTable
} from '../support/variables-table.po';
import { getDialog } from '../support/common.po';
import { getConfirmCancelButton, getConfirmConfirmButton, getConfirmList } from '../support/confirm.po';

// Constants
const prjID = 'test-1';

// Init
beforeEach(() => {
  cy.login();
  cy.visit(`/projects/${Cypress.env('userId')}/${prjID}/variables`);

  // APIs
  cy.intercept('GET', `**/api/*/projects/${prjID}/variables`).as('getVariables');
  cy.intercept('POST', `**/api/*/projects/${prjID}/variables`).as('createVariable');
  cy.intercept('DELETE', `**/api/*/projects/${prjID}/variables?*`).as('deleteVariables');
});

// Test suites
describe('Variables table', () => {
  // Tests
  it('should show variable table', () => {
    cy.wait('@getVariables');

    getVariablesTable().should('exist');
    getVariablesTable().findAllByRole('row').should('have.length', '3');
    getVariablesTable().findByText('TEST_1').should('exist');
    getVariablesTable().findByText('TEST_2').should('exist');
  });
});

describe('Add a new variable', () => {
  const vrbId = 'cypress-add-var-test';
  const vrbName = 'CYPRESS_ADD_VAR_TEST';

  afterEach(() => {
    // Remove created variable
    cy.request({
      method: 'DELETE',
      url: `/api/${Cypress.env('userId')}/projects/${prjID}/variables/${vrbId}`,
      headers: {
        'Authorization': `Bearer ${Cypress.env('accessToken')}`,
      }
    });
  });

  // Tests
  it('should add a new variable', () => {
    // Assert variable does not exist
    cy.wait('@getVariables');
    getVariablesTable().findByText(vrbName).should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getDialogNameField().type(vrbName);
    getDialogSlugField().should('have.value', vrbId);
    getDialogValueField().type('test');

    // Submit form
    getDialogSubmitButton().click();
    getDialogLoader().should('exist');

    // Await creation
    cy.wait('@createVariable');
    getDialog().should('not.exist');
    getVariablesTable().findByText(vrbName).should('exist');
    getVariableRow(vrbName).findByText('test');
  });

  it('should show field errors', () => {
    cy.intercept('POST', `**/api/*/projects/${prjID}/variables`, (req) => {
      req.reply(400, {
        statusCode: 400,
        error: 'Bad Request',
        message: [
          { path: 'id', type: 'cypress', errors: ['cypress generated error on id'] },
          { path: 'name', type: 'cypress', errors: ['cypress generated error on name'] },
          { path: 'value', type: 'cypress', errors: ['cypress generated error on value'] },
        ]
      });
    }).as('createVariable');

    // Assert variable does not exist
    cy.wait('@getVariables');
    getVariablesTable().findByText(vrbName).should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getDialogNameField().type(vrbName);
    getDialogValueField().type('test');

    // Submit and check for errors
    getDialogSubmitButton().click();
    cy.wait('@createVariable');

    getDialogSlugField()
      .parent().parent()
      .findByText('cypress generated error on id').should('exist');
    getDialogNameField()
      .parent().parent()
      .findByText('cypress generated error on name').should('exist');
    getDialogValueField()
      .parent().parent()
      .findByText('cypress generated error on value').should('exist');
  });

  it('should show conflict errors', () => {
    cy.intercept('POST', `**/api/*/projects/${prjID}/variables`, (req) => {
      req.reply(409, {
        statusCode: 409,
        error: 'Conflict',
        message: `Variable with id ${vrbId} already exists`
      });
    }).as('createVariable');

    // Assert variable does not exist
    cy.wait('@getVariables');
    getVariablesTable().findByText(vrbName).should('not.exist');

    // Open creation dialog
    getAddButton().click();

    // Fill form
    getDialogNameField().type(vrbName);
    getDialogValueField().type('test');

    // Submit and check for errors
    getDialogSubmitButton().click();
    cy.wait('@createVariable');

    getDialogSlugField()
      .parent().parent()
      .findByText(`Variable with id ${vrbId} already exists`).should('exist');
  });
});

describe('Delete a variable', () => {
  const vrbId = 'cypress-delete-var-test';
  const vrbName = 'CYPRESS_DELETE_VAR_TEST';

  beforeEach(() => {
    // Remove created variable
    cy.request({
      method: 'POST',
      url: `/api/${Cypress.env('userId')}/projects/${prjID}/variables`,
      body: {
        id: vrbId,
        name: vrbName,
        value: 'test'
      },
      headers: {
        'Authorization': `Bearer ${Cypress.env('accessToken')}`,
      }
    });

    cy.reload();
  });

  afterEach(() => {
    // Remove created variable
    cy.request({
      method: 'DELETE',
      url: `/api/${Cypress.env('userId')}/projects/${prjID}/variables/${vrbId}`,
      headers: {
        'Authorization': `Bearer ${Cypress.env('accessToken')}`,
      }
    });
  });

  // Tests
  it('should delete a variable', () => {
    // Assert variable does exist
    cy.wait('@getVariables');
    getVariablesTable().findByText(vrbName).should('exist');

    // Select project
    getVariableRow(vrbName).findByRole('checkbox').click();
    getDeleteButton().click();

    // Confirm should contain list of selected projects
    getConfirmList().findByRole('listitem')
      .should('contain.text', vrbName)
      .and('contain.text', vrbId);

    // Confirm
    getConfirmConfirmButton().click();

    // Assert project dont exist
    cy.wait('@deleteVariables');
    getVariablesTable().findByText(vrbName).should('not.exist');
  });

  it('should cancel and do not delete', () => {
    // Assert variable does exist
    cy.wait('@getVariables');
    getVariablesTable().findByText(vrbName).should('exist');

    // Select project
    getVariableRow(vrbName).findByRole('checkbox').click();
    getDeleteButton().click();

    // Confirm should contain list of selected projects
    getConfirmList().findByRole('listitem')
      .should('contain.text', vrbName)
      .and('contain.text', vrbId);

    // Confirm
    getConfirmCancelButton().click();

    // Assert project dont exist
    getVariablesTable().findByText(vrbName).should('exist');
  });
});
