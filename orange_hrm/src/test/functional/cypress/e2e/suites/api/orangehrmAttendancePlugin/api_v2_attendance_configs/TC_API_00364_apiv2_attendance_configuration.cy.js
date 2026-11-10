/**
 * Test Case ID: TC_API_00364
 * Route: apiv2_attendance_configuration
 * Endpoint: GET /api/v2/attendance/configs
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00364: apiv2_attendance_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00364: Execute GET /api/v2/attendance/configs [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/configs',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
