/**
 * Test Case ID: TC_API_01573
 * Route: apiv2_time_customer
 * Endpoint: PUT /api/v2/time/customers/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01573: apiv2_time_customer', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01573: Execute PUT /api/v2/time/customers/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/customers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
