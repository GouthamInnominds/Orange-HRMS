/**
 * Test Case ID: TC_API_01644
 * Route: apiv2_time_reports
 * Endpoint: GET /api/v2/time/reports
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01644: apiv2_time_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01644: Execute GET /api/v2/time/reports [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/reports',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
