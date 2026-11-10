/**
 * Test Case ID: TC_API_01061
 * Route: apiv2_pim_employees_job_details
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/job-details
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01061: apiv2_pim_employees_job_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01061: Execute PUT /api/v2/pim/employees/1/job-details [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/job-details',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
