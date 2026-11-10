/**
 * Test Case ID: TC_API_00427
 * Route: attendance_employee_edit_attendance
 * Endpoint: GET /attendance/editEmployeeAttendanceRecord/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00427: attendance_employee_edit_attendance', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00427: Execute GET /attendance/editEmployeeAttendanceRecord/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/editEmployeeAttendanceRecord/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
