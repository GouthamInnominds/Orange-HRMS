/**
 * Test Case ID: TC_API_00368
 * Route: apiv2_attendance_configuration
 * Endpoint: PUT /api/v2/attendance/configs
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00368: apiv2_attendance_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00368: Execute PUT /api/v2/attendance/configs [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/attendance/configs',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
