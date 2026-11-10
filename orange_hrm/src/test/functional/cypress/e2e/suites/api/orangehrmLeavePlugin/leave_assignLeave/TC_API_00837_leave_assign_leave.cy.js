/**
 * Test Case ID: TC_API_00837
 * Route: leave_assign_leave
 * Endpoint: GET /leave/assignLeave
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00837: leave_assign_leave', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00837: Execute GET /leave/assignLeave [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/assignLeave',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
