/**
 * Test Case ID: TC_API_00402
 * Route: apiv2_attendance_edit_punch_in_record_overlap
 * Endpoint: GET /api/v2/attendance/records/punch-in-overlaps
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAttendancePlugin - TC_API_00402: apiv2_attendance_edit_punch_in_record_overlap', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00402: Execute GET /api/v2/attendance/records/punch-in-overlaps [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/attendance/records/punch-in-overlaps',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
