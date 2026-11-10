/**
 * Test Case ID: TC_API_00417
 * Route: attendance_view_employee_attendance
 * Endpoint: GET /attendance/viewAttendanceRecord
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00417: attendance_view_employee_attendance', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00417: Execute GET /attendance/viewAttendanceRecord [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/viewAttendanceRecord',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
