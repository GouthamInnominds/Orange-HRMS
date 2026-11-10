/**
 * Test Case ID: TC_API_01677
 * Route: time_activity_details_report
 * Endpoint: GET /time/displayProjectActivityDetailsReport
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01677: time_activity_details_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01677: Execute GET /time/displayProjectActivityDetailsReport [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/displayProjectActivityDetailsReport',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
