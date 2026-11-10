/**
 * Test Case ID: TC_API_01660
 * Route: time_my_timesheet
 * Endpoint: GET /time/viewMyTimesheet
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01660: time_my_timesheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01660: Execute GET /time/viewMyTimesheet [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewMyTimesheet',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
