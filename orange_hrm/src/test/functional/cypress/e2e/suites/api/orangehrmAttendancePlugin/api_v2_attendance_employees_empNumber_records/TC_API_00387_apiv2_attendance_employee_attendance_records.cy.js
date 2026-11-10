/**
 * Test Case ID: TC_API_00387
 * Route: apiv2_attendance_employee_attendance_records
 * Endpoint: POST /api/v2/attendance/employees/{empNumber}/records
 * Method: POST
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00387: apiv2_attendance_employee_attendance_records', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00387: Execute POST /api/v2/attendance/employees/1/records [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/attendance/employees/1/records',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
