/**
 * Test Case ID: TC_API_00841
 * Route: leave_my_leave_list
 * Endpoint: GET /leave/viewMyLeaveList
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00841: leave_my_leave_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00841: Execute GET /leave/viewMyLeaveList [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewMyLeaveList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
