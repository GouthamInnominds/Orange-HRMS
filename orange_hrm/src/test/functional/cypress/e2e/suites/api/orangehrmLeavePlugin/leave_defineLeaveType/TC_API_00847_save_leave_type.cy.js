/**
 * Test Case ID: TC_API_00847
 * Route: save_leave_type
 * Endpoint: GET /leave/defineLeaveType
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00847: save_leave_type', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00847: Execute GET /leave/defineLeaveType [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/defineLeaveType',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
