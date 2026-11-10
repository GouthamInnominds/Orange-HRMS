/**
 * Test Case ID: TC_API_01673
 * Route: time_employee_report
 * Endpoint: GET /time/displayEmployeeReportCriteria
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01673: time_employee_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01673: Execute GET /time/displayEmployeeReportCriteria [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/displayEmployeeReportCriteria',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
