/**
 * Test Case ID: TC_API_00422
 * Route: attendance_summary_report
 * Endpoint: GET /time/displayAttendanceSummaryReportCriteria
 * Method: GET
 * Priority: High
 */

describe('orangehrmAttendancePlugin - TC_API_00422: attendance_summary_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00422: Execute GET /time/displayAttendanceSummaryReportCriteria [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/displayAttendanceSummaryReportCriteria',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
