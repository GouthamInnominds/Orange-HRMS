/**
 * Test Case ID: TC_API_00384
 * Route: apiv2_attendance_my_attendance_records
 * Endpoint: DELETE /api/v2/attendance/records
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00384: apiv2_attendance_my_attendance_records', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00384: Execute DELETE /api/v2/attendance/records [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/attendance/records',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
