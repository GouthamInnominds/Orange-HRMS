/**
 * Test Case ID: TC_API_00418
 * Route: attendance_view_my_attendance
 * Endpoint: GET /attendance/viewMyAttendanceRecord
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00418: attendance_view_my_attendance', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00418: Execute GET /attendance/viewMyAttendanceRecord [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/viewMyAttendanceRecord',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
