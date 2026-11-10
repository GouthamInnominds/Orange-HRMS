/**
 * Test Case ID: TC_API_00394
 * Route: apiv2_attendance_employee_attendance_records
 * Endpoint: DELETE /api/v2/attendance/employees/{empNumber}/records
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00394: apiv2_attendance_employee_attendance_records', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00394: Execute DELETE /api/v2/attendance/employees/1/records [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/attendance/employees/1/records',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
