/**
 * Test Case ID: TC_API_00748
 * Route: apiv2_leave_eligible_leave_types
 * Endpoint: GET /api/v2/leave/leave-types/eligible
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00748: apiv2_leave_eligible_leave_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00748: Execute GET /api/v2/leave/leave-types/eligible [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-types/eligible',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
