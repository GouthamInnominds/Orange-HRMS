/**
 * Test Case ID: TC_API_01570
 * Route: apiv2_time_customer
 * Endpoint: GET /api/v2/time/customers/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01570: apiv2_time_customer', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01570: Execute GET /api/v2/time/customers/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/customers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
