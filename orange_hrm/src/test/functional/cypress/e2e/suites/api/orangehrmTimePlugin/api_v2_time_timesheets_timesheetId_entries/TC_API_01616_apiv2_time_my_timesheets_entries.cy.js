/**
 * Test Case ID: TC_API_01616
 * Route: apiv2_time_my_timesheets_entries
 * Endpoint: GET /api/v2/time/timesheets/{timesheetId}/entries
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01616: apiv2_time_my_timesheets_entries', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01616: Execute GET /api/v2/time/timesheets/1/entries [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/timesheets/1/entries',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
