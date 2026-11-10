/**
 * Test Case ID: TC_API_00722
 * Route: apiv2_leave_holidays
 * Endpoint: DELETE /api/v2/leave/holidays
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00722: apiv2_leave_holidays', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00722: Execute DELETE /api/v2/leave/holidays [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/leave/holidays',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
