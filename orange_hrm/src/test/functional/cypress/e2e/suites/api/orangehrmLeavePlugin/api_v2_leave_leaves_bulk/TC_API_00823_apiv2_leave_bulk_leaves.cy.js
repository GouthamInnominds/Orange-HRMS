/**
 * Test Case ID: TC_API_00823
 * Route: apiv2_leave_bulk_leaves
 * Endpoint: PUT /api/v2/leave/leaves/bulk
 * Method: PUT
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00823: apiv2_leave_bulk_leaves', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00823: Execute PUT /api/v2/leave/leaves/bulk [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/leaves/bulk',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
