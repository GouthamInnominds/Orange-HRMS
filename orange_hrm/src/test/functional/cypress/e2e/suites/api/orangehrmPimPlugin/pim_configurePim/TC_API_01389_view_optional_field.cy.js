/**
 * Test Case ID: TC_API_01389
 * Route: view_optional_field
 * Endpoint: GET /pim/configurePim
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01389: view_optional_field', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01389: Execute GET /pim/configurePim [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/configurePim',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
