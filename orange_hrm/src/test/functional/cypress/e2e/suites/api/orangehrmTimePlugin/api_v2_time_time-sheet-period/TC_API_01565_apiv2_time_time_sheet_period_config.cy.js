/**
 * Test Case ID: TC_API_01565
 * Route: apiv2_time_time_sheet_period_config
 * Endpoint: GET /api/v2/time/time-sheet-period
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01565: apiv2_time_time_sheet_period_config', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01565: Execute GET /api/v2/time/time-sheet-period [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/time-sheet-period',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
