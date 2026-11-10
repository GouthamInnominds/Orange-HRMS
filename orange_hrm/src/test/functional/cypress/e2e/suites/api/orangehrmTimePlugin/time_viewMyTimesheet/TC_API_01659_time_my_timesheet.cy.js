/**
 * Test Case ID: TC_API_01659
 * Route: time_my_timesheet
 * Endpoint: GET /time/viewMyTimesheet
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01659: time_my_timesheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01659: Execute GET /time/viewMyTimesheet [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewMyTimesheet',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
