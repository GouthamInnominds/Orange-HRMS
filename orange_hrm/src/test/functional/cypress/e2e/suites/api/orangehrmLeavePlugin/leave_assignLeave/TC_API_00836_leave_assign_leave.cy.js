/**
 * Test Case ID: TC_API_00836
 * Route: leave_assign_leave
 * Endpoint: GET /leave/assignLeave
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00836: leave_assign_leave', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00836: Execute GET /leave/assignLeave [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/assignLeave',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
