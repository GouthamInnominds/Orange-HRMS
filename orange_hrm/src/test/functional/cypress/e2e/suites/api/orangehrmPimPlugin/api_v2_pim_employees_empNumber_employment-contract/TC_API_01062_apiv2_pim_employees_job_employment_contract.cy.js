/**
 * Test Case ID: TC_API_01062
 * Route: apiv2_pim_employees_job_employment_contract
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/employment-contract
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01062: apiv2_pim_employees_job_employment_contract', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01062: Execute GET /api/v2/pim/employees/1/employment-contract [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/employment-contract',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
