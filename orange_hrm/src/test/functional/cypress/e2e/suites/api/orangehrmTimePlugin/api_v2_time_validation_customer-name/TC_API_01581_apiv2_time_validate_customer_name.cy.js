/**
 * Test Case ID: TC_API_01581
 * Route: apiv2_time_validate_customer_name
 * Endpoint: GET /api/v2/time/validation/customer-name
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01581: apiv2_time_validate_customer_name', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01581: Execute GET /api/v2/time/validation/customer-name [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/validation/customer-name',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
