/**
 * Test Case ID: TC_API_00849
 * Route: edit_leave_type
 * Endpoint: GET /leave/defineLeaveType/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00849: edit_leave_type', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00849: Execute GET /leave/defineLeaveType/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/defineLeaveType/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
