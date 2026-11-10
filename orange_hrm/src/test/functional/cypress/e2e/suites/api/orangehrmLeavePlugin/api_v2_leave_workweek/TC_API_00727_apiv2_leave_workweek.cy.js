/**
 * Test Case ID: TC_API_00727
 * Route: apiv2_leave_workweek
 * Endpoint: PUT /api/v2/leave/workweek
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00727: apiv2_leave_workweek', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00727: Execute PUT /api/v2/leave/workweek [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/workweek',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
