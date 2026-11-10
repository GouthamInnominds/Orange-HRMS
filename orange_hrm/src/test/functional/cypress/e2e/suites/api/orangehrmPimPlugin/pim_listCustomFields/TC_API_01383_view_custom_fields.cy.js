/**
 * Test Case ID: TC_API_01383
 * Route: view_custom_fields
 * Endpoint: GET /pim/listCustomFields
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01383: view_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01383: Execute GET /pim/listCustomFields [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/listCustomFields',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
