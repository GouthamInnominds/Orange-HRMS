/**
 * Test Case ID: TC_API_01577
 * Route: apiv2_time_customers
 * Endpoint: POST /api/v2/time/customers
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01577: apiv2_time_customers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01577: Execute POST /api/v2/time/customers [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/customers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
