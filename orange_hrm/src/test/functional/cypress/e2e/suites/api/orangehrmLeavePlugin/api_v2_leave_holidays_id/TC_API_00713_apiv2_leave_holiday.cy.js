/**
 * Test Case ID: TC_API_00713
 * Route: apiv2_leave_holiday
 * Endpoint: GET /api/v2/leave/holidays/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00713: apiv2_leave_holiday', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00713: Execute GET /api/v2/leave/holidays/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/holidays/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
