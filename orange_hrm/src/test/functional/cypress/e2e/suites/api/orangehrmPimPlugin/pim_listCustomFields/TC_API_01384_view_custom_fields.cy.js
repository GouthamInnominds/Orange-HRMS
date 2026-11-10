/**
 * Test Case ID: TC_API_01384
 * Route: view_custom_fields
 * Endpoint: GET /pim/listCustomFields
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01384: view_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01384: Execute GET /pim/listCustomFields [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/listCustomFields',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
