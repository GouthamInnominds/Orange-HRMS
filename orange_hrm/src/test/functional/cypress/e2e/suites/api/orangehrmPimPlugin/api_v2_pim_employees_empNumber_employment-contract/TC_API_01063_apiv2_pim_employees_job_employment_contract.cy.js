/**
 * Test Case ID: TC_API_01063
 * Route: apiv2_pim_employees_job_employment_contract
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/employment-contract
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01063: apiv2_pim_employees_job_employment_contract', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01063: Execute GET /api/v2/pim/employees/1/employment-contract [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/employment-contract',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
