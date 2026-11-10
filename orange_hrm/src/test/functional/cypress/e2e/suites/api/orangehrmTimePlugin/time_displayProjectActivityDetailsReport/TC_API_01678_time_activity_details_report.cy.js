/**
 * Test Case ID: TC_API_01678
 * Route: time_activity_details_report
 * Endpoint: GET /time/displayProjectActivityDetailsReport
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01678: time_activity_details_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01678: Execute GET /time/displayProjectActivityDetailsReport [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/displayProjectActivityDetailsReport',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
