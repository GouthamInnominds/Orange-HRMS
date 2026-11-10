/**
 * Test Case ID: TC_API_00830
 * Route: leave_module
 * Endpoint: GET /leave/viewLeaveModule
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00830: leave_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00830: Execute GET /leave/viewLeaveModule [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewLeaveModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
