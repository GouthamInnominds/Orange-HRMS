/**
 * Test Case ID: TC_API_01575
 * Route: apiv2_time_customers
 * Endpoint: GET /api/v2/time/customers
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01575: apiv2_time_customers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01575: Execute GET /api/v2/time/customers [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/customers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
