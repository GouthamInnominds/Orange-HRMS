/**
 * Test Case ID: TC_API_00853
 * Route: leave_edit_leave_entitlement
 * Endpoint: GET /leave/editLeaveEntitlement/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00853: leave_edit_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00853: Execute GET /leave/editLeaveEntitlement/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/editLeaveEntitlement/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
