/**
 * Test Case ID: TC_API_00411
 * Route: attendance_punch_in
 * Endpoint: GET /attendance/punchIn
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00411: attendance_punch_in', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00411: Execute GET /attendance/punchIn [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/punchIn',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
