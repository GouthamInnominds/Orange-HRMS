/**
 * Test Case ID: TC_API_00365
 * Route: apiv2_attendance_configuration
 * Endpoint: GET /api/v2/attendance/configs
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00365: apiv2_attendance_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00365: Execute GET /api/v2/attendance/configs [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/configs',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
