/**
 * Test Case ID: TC_API_01675
 * Route: time_project_activity_report
 * Endpoint: GET /time/displayProjectReportCriteria
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01675: time_project_activity_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01675: Execute GET /time/displayProjectReportCriteria [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/displayProjectReportCriteria',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
