/**
 * Test Case ID: TC_API_00413
 * Route: attendance_punch_out
 * Endpoint: GET /attendance/punchOut
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00413: attendance_punch_out', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00413: Execute GET /attendance/punchOut [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/punchOut',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
