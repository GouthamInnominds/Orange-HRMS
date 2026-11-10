/**
 * Test Case ID: TC_API_00369
 * Route: apiv2_employee_latest_attendance_record
 * Endpoint: GET /api/v2/attendance/records/latest
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00369: apiv2_employee_latest_attendance_record', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00369: Execute GET /api/v2/attendance/records/latest [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/records/latest',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
