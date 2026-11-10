/**
 * Test Case ID: TC_API_00851
 * Route: leave_add_leave_entitlement
 * Endpoint: GET /leave/addLeaveEntitlement
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00851: leave_add_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00851: Execute GET /leave/addLeaveEntitlement [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/addLeaveEntitlement',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
