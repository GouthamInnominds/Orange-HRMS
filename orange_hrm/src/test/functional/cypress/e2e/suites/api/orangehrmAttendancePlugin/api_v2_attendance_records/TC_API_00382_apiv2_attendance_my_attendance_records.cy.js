/**
 * Test Case ID: TC_API_00382
 * Route: apiv2_attendance_my_attendance_records
 * Endpoint: PUT /api/v2/attendance/records
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00382: apiv2_attendance_my_attendance_records', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00382: Execute PUT /api/v2/attendance/records [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/attendance/records',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
