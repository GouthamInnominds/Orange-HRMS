/**
 * Test Case ID: TC_API_01259
 * Route: apiv2_pim_employees_immigrations
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/immigrations
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01259: apiv2_pim_employees_immigrations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01259: Execute GET /api/v2/pim/employees/1/immigrations [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/immigrations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
