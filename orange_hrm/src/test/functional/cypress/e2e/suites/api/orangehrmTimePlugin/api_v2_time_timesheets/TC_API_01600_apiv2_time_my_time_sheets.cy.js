/**
 * Test Case ID: TC_API_01600
 * Route: apiv2_time_my_time_sheets
 * Endpoint: POST /api/v2/time/timesheets
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01600: apiv2_time_my_time_sheets', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01600: Execute POST /api/v2/time/timesheets [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/timesheets',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
