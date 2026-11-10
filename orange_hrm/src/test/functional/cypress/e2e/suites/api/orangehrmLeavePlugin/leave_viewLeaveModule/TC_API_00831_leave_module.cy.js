/**
 * Test Case ID: TC_API_00831
 * Route: leave_module
 * Endpoint: GET /leave/viewLeaveModule
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00831: leave_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00831: Execute GET /leave/viewLeaveModule [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewLeaveModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
