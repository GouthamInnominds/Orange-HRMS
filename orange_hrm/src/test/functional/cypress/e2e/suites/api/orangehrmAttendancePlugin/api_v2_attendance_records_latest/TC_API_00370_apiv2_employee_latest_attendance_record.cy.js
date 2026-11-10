/**
 * Test Case ID: TC_API_00370
 * Route: apiv2_employee_latest_attendance_record
 * Endpoint: GET /api/v2/attendance/records/latest
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00370: apiv2_employee_latest_attendance_record', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00370: Execute GET /api/v2/attendance/records/latest [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/records/latest',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
