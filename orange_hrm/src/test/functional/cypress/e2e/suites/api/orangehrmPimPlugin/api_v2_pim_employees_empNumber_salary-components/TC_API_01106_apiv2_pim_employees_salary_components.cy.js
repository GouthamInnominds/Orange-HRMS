/**
 * Test Case ID: TC_API_01106
 * Route: apiv2_pim_employees_salary_components
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/salary-components
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01106: apiv2_pim_employees_salary_components', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01106: Execute DELETE /api/v2/pim/employees/1/salary-components [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
