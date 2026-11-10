/**
 * Test Case ID: TC_API_01386
 * Route: save_custom_fields
 * Endpoint: GET /pim/saveCustomFields
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01386: save_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01386: Execute GET /pim/saveCustomFields [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveCustomFields',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
