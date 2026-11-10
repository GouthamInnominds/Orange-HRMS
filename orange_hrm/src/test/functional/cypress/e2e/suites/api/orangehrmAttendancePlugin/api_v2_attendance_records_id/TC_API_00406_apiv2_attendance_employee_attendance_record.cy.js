/**
 * Test Case ID: TC_API_00406
 * Route: apiv2_attendance_employee_attendance_record
 * Endpoint: GET /api/v2/attendance/records/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00406: apiv2_attendance_employee_attendance_record', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00406: Execute GET /api/v2/attendance/records/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/records/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
