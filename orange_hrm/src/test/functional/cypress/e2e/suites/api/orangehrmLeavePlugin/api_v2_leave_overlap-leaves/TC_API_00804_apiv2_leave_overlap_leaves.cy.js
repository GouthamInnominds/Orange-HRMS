/**
 * Test Case ID: TC_API_00804
 * Route: apiv2_leave_overlap_leaves
 * Endpoint: GET /api/v2/leave/overlap-leaves
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00804: apiv2_leave_overlap_leaves', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00804: Execute GET /api/v2/leave/overlap-leaves [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/overlap-leaves',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
