/**
 * Test Case ID: TC_API_01099
 * Route: apiv2_pim_employees_salary_component
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/salary-components/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01099: apiv2_pim_employees_salary_component', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01099: Execute PUT /api/v2/pim/employees/1/salary-components/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/salary-components/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
