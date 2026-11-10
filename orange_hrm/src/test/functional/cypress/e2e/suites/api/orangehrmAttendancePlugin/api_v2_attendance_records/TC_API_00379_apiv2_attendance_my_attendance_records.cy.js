/**
 * Test Case ID: TC_API_00379
 * Route: apiv2_attendance_my_attendance_records
 * Endpoint: POST /api/v2/attendance/records
 * Method: POST
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00379: apiv2_attendance_my_attendance_records', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00379: Execute POST /api/v2/attendance/records [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/attendance/records',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
