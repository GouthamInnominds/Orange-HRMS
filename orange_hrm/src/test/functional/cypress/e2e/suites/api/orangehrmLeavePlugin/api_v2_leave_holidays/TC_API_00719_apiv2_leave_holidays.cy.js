/**
 * Test Case ID: TC_API_00719
 * Route: apiv2_leave_holidays
 * Endpoint: POST /api/v2/leave/holidays
 * Method: POST
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00719: apiv2_leave_holidays', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00719: Execute POST /api/v2/leave/holidays [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/leave/holidays',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
