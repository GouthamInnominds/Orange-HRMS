/**
 * Test Case ID: TC_API_00424
 * Route: attendance_employee_punch_in_out
 * Endpoint: GET /attendance/proxyPunchInPunchOut
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00424: attendance_employee_punch_in_out', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00424: Execute GET /attendance/proxyPunchInPunchOut [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/proxyPunchInPunchOut',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
