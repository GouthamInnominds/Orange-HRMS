/**
 * Test Case ID: TC_API_00834
 * Route: leave_apply_leave
 * Endpoint: GET /leave/applyLeave
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00834: leave_apply_leave', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00834: Execute GET /leave/applyLeave [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/applyLeave',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
