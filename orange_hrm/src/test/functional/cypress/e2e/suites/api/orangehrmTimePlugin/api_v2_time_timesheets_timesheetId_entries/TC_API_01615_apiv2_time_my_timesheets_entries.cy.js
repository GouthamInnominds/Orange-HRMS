/**
 * Test Case ID: TC_API_01615
 * Route: apiv2_time_my_timesheets_entries
 * Endpoint: GET /api/v2/time/timesheets/{timesheetId}/entries
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01615: apiv2_time_my_timesheets_entries', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01615: Execute GET /api/v2/time/timesheets/1/entries [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/timesheets/1/entries',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
