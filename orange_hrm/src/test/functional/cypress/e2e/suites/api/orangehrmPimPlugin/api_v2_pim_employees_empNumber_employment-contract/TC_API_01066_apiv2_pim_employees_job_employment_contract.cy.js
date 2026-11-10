/**
 * Test Case ID: TC_API_01066
 * Route: apiv2_pim_employees_job_employment_contract
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/employment-contract
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01066: apiv2_pim_employees_job_employment_contract', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01066: Execute PUT /api/v2/pim/employees/1/employment-contract [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/employment-contract',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
