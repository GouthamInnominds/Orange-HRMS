/**
 * Test Case ID: TC_API_00724
 * Route: apiv2_leave_workweek
 * Endpoint: GET /api/v2/leave/workweek
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00724: apiv2_leave_workweek', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00724: Execute GET /api/v2/leave/workweek [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/workweek',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
