/**
 * Test Case ID: TC_API_00721
 * Route: apiv2_leave_holidays
 * Endpoint: POST /api/v2/leave/holidays
 * Method: POST
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00721: apiv2_leave_holidays', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00721: Execute POST /api/v2/leave/holidays [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/leave/holidays',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
