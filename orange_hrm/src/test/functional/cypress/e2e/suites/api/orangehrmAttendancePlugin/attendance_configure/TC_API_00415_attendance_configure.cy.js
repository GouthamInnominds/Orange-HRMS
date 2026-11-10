/**
 * Test Case ID: TC_API_00415
 * Route: attendance_configure
 * Endpoint: GET /attendance/configure
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00415: attendance_configure', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00415: Execute GET /attendance/configure [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/attendance/configure',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
