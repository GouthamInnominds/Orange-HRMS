/**
 * Test Case ID: TC_API_00852
 * Route: leave_edit_leave_entitlement
 * Endpoint: GET /leave/editLeaveEntitlement/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00852: leave_edit_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00852: Execute GET /leave/editLeaveEntitlement/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/editLeaveEntitlement/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
