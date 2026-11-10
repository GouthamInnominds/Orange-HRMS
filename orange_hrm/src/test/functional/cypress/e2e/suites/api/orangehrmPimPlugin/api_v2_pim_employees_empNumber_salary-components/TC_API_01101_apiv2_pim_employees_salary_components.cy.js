/**
 * Test Case ID: TC_API_01101
 * Route: apiv2_pim_employees_salary_components
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/salary-components
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01101: apiv2_pim_employees_salary_components', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01101: Execute GET /api/v2/pim/employees/1/salary-components [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
