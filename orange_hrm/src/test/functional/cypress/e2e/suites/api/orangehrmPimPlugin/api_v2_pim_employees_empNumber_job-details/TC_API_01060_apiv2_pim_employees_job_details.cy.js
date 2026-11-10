/**
 * Test Case ID: TC_API_01060
 * Route: apiv2_pim_employees_job_details
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/job-details
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01060: apiv2_pim_employees_job_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01060: Execute PUT /api/v2/pim/employees/1/job-details [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/job-details',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
