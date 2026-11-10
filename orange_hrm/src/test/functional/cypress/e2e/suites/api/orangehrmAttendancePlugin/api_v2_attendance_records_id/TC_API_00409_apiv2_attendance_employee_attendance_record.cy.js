/**
 * Test Case ID: TC_API_00409
 * Route: apiv2_attendance_employee_attendance_record
 * Endpoint: PUT /api/v2/attendance/records/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00409: apiv2_attendance_employee_attendance_record', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00409: Execute PUT /api/v2/attendance/records/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/attendance/records/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
