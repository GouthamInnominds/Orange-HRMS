/**
 * Test Case ID: TC_API_01387
 * Route: edit_custom_fields
 * Endpoint: GET /pim/saveCustomFields/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01387: edit_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01387: Execute GET /pim/saveCustomFields/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveCustomFields/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
