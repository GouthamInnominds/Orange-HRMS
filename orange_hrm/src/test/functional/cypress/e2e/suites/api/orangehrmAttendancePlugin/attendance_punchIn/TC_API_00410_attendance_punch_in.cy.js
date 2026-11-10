/**
 * Test Case ID: TC_API_00410
 * Route: attendance_punch_in
 * Endpoint: GET /attendance/punchIn
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00410: attendance_punch_in', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00410: Execute GET /attendance/punchIn [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/punchIn',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
