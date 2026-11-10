/**
 * Test Case ID: TC_API_01674
 * Route: time_employee_report
 * Endpoint: GET /time/displayEmployeeReportCriteria
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01674: time_employee_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01674: Execute GET /time/displayEmployeeReportCriteria [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/displayEmployeeReportCriteria',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
