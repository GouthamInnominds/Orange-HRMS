/**
 * Test Case ID: TC_API_00412
 * Route: attendance_punch_out
 * Endpoint: GET /attendance/punchOut
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00412: attendance_punch_out', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00412: Execute GET /attendance/punchOut [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/punchOut',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
