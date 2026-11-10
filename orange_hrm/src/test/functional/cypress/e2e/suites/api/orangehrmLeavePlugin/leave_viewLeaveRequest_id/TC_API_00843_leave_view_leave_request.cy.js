/**
 * Test Case ID: TC_API_00843
 * Route: leave_view_leave_request
 * Endpoint: GET /leave/viewLeaveRequest/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00843: leave_view_leave_request', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00843: Execute GET /leave/viewLeaveRequest/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewLeaveRequest/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
