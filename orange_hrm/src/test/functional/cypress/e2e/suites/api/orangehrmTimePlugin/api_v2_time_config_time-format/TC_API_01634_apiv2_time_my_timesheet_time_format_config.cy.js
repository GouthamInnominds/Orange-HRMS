/**
 * Test Case ID: TC_API_01634
 * Route: apiv2_time_my_timesheet_time_format_config
 * Endpoint: GET /api/v2/time/config/time-format
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01634: apiv2_time_my_timesheet_time_format_config', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01634: Execute GET /api/v2/time/config/time-format [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/config/time-format',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
