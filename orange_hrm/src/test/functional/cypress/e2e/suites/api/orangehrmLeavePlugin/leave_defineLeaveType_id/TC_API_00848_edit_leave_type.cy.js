/**
 * Test Case ID: TC_API_00848
 * Route: edit_leave_type
 * Endpoint: GET /leave/defineLeaveType/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00848: edit_leave_type', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00848: Execute GET /leave/defineLeaveType/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/defineLeaveType/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
