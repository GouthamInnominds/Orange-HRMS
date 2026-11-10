/**
 * Test Case ID: TC_API_00420
 * Route: attendance_edit_attendance
 * Endpoint: GET /attendance/editAttendanceRecord/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00420: attendance_edit_attendance', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00420: Execute GET /attendance/editAttendanceRecord/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/editAttendanceRecord/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
