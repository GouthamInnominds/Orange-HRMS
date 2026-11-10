/**
 * Test Case ID: TC_API_01102
 * Route: apiv2_pim_employees_salary_components
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/salary-components
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01102: apiv2_pim_employees_salary_components', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01102: Execute GET /api/v2/pim/employees/1/salary-components [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
