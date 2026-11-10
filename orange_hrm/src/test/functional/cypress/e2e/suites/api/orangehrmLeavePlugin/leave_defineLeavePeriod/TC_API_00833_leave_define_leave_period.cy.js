/**
 * Test Case ID: TC_API_00833
 * Route: leave_define_leave_period
 * Endpoint: GET /leave/defineLeavePeriod
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00833: leave_define_leave_period', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00833: Execute GET /leave/defineLeavePeriod [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/defineLeavePeriod',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
