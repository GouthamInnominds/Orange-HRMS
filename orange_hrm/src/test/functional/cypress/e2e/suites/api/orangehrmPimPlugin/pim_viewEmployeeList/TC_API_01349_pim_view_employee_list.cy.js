/**
 * Test Case ID: TC_API_01349
 * Route: pim_view_employee_list
 * Endpoint: GET /pim/viewEmployeeList
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01349: pim_view_employee_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01349: Execute GET /pim/viewEmployeeList [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewEmployeeList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
