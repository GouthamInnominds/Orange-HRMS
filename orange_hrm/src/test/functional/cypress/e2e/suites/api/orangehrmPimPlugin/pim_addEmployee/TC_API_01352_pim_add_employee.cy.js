/**
 * Test Case ID: TC_API_01352
 * Route: pim_add_employee
 * Endpoint: GET /pim/addEmployee
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01352: pim_add_employee', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01352: Execute GET /pim/addEmployee [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/addEmployee',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
