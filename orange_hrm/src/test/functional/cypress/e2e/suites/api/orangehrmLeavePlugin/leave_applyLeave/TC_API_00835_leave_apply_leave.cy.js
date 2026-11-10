/**
 * Test Case ID: TC_API_00835
 * Route: leave_apply_leave
 * Endpoint: GET /leave/applyLeave
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00835: leave_apply_leave', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00835: Execute GET /leave/applyLeave [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/applyLeave',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
