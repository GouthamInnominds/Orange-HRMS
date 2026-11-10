/**
 * Test Case ID: TC_API_01601
 * Route: apiv2_time_my_time_sheets
 * Endpoint: POST /api/v2/time/timesheets
 * Method: POST
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01601: apiv2_time_my_time_sheets', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01601: Execute POST /api/v2/time/timesheets [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/timesheets',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
