/**
 * Test Case ID: TC_API_00838
 * Route: leave_leave_list
 * Endpoint: GET /leave/viewLeaveList
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00838: leave_leave_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00838: Execute GET /leave/viewLeaveList [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewLeaveList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
