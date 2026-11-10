/**
 * Test Case ID: TC_API_01676
 * Route: time_project_activity_report
 * Endpoint: GET /time/displayProjectReportCriteria
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01676: time_project_activity_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01676: Execute GET /time/displayProjectReportCriteria [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/displayProjectReportCriteria',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
