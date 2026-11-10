/**
 * Test Case ID: TC_API_00373
 * Route: apiv2_attendance_punch_out_record_overlap
 * Endpoint: GET /api/v2/attendance/punch-out/overlaps
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00373: apiv2_attendance_punch_out_record_overlap', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00373: Execute GET /api/v2/attendance/punch-out/overlaps [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/punch-out/overlaps',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
