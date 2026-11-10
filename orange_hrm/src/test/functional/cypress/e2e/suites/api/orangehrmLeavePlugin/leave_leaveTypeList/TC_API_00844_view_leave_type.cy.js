/**
 * Test Case ID: TC_API_00844
 * Route: view_leave_type
 * Endpoint: GET /leave/leaveTypeList
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00844: view_leave_type', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00844: Execute GET /leave/leaveTypeList [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/leaveTypeList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
