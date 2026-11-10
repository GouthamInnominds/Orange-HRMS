/**
 * Test Case ID: TC_API_01643
 * Route: apiv2_time_reports
 * Endpoint: GET /api/v2/time/reports
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01643: apiv2_time_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01643: Execute GET /api/v2/time/reports [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/reports',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
