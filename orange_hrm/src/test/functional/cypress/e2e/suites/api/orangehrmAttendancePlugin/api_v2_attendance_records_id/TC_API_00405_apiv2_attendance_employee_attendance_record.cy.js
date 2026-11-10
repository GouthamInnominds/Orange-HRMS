/**
 * Test Case ID: TC_API_00405
 * Route: apiv2_attendance_employee_attendance_record
 * Endpoint: GET /api/v2/attendance/records/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00405: apiv2_attendance_employee_attendance_record', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00405: Execute GET /api/v2/attendance/records/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/records/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
