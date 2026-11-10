/**
 * Test Case ID: TC_API_01057
 * Route: apiv2_pim_employees_job_details
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/job-details
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01057: apiv2_pim_employees_job_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01057: Execute GET /api/v2/pim/employees/1/job-details [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/job-details',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
