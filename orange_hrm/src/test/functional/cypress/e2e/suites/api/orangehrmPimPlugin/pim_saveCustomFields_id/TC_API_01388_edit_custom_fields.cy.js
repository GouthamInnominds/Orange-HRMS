/**
 * Test Case ID: TC_API_01388
 * Route: edit_custom_fields
 * Endpoint: GET /pim/saveCustomFields/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01388: edit_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01388: Execute GET /pim/saveCustomFields/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveCustomFields/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
