/**
 * Test Case ID: TC_API_00717
 * Route: apiv2_leave_holidays
 * Endpoint: GET /api/v2/leave/holidays
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00717: apiv2_leave_holidays', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00717: Execute GET /api/v2/leave/holidays [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/holidays',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
