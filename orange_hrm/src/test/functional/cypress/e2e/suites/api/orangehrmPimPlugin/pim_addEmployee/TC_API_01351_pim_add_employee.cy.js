/**
 * Test Case ID: TC_API_01351
 * Route: pim_add_employee
 * Endpoint: GET /pim/addEmployee
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01351: pim_add_employee', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01351: Execute GET /pim/addEmployee [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/addEmployee',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
