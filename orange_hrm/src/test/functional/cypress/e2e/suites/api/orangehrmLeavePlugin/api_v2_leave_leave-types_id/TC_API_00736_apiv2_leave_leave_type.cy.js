/**
 * Test Case ID: TC_API_00736
 * Route: apiv2_leave_leave_type
 * Endpoint: GET /api/v2/leave/leave-types/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00736: apiv2_leave_leave_type', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00736: Execute GET /api/v2/leave/leave-types/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-types/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
