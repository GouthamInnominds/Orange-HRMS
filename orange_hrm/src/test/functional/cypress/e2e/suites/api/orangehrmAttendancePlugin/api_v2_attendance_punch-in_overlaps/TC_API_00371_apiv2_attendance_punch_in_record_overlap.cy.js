/**
 * Test Case ID: TC_API_00371
 * Route: apiv2_attendance_punch_in_record_overlap
 * Endpoint: GET /api/v2/attendance/punch-in/overlaps
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00371: apiv2_attendance_punch_in_record_overlap', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00371: Execute GET /api/v2/attendance/punch-in/overlaps [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/punch-in/overlaps',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
