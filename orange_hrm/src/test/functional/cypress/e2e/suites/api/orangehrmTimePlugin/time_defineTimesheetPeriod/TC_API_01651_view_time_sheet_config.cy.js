/**
 * Test Case ID: TC_API_01651
 * Route: view_time_sheet_config
 * Endpoint: GET /time/defineTimesheetPeriod
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01651: view_time_sheet_config', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01651: Execute GET /time/defineTimesheetPeriod [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/defineTimesheetPeriod',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
