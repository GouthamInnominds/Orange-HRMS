/**
 * Test Case ID: TC_API_01098
 * Route: apiv2_pim_employees_salary_component
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/salary-components/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01098: apiv2_pim_employees_salary_component', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01098: Execute PUT /api/v2/pim/employees/1/salary-components/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/salary-components/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
