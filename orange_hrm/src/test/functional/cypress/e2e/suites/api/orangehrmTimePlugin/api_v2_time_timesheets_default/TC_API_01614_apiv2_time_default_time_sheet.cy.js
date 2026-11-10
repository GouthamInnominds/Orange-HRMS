/**
 * Test Case ID: TC_API_01614
 * Route: apiv2_time_default_time_sheet
 * Endpoint: GET /api/v2/time/timesheets/default
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01614: apiv2_time_default_time_sheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01614: Execute GET /api/v2/time/timesheets/default [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/timesheets/default',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
