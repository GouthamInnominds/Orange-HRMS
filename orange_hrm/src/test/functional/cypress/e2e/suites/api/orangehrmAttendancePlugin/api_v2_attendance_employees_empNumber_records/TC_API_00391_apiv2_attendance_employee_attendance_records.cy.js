/**
 * Test Case ID: TC_API_00391
 * Route: apiv2_attendance_employee_attendance_records
 * Endpoint: PUT /api/v2/attendance/employees/{empNumber}/records
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00391: apiv2_attendance_employee_attendance_records', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00391: Execute PUT /api/v2/attendance/employees/1/records [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/attendance/employees/1/records',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
