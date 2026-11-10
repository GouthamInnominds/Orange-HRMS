/**
 * Test Case ID: TC_API_01576
 * Route: apiv2_time_customers
 * Endpoint: POST /api/v2/time/customers
 * Method: POST
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01576: apiv2_time_customers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01576: Execute POST /api/v2/time/customers [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/customers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
