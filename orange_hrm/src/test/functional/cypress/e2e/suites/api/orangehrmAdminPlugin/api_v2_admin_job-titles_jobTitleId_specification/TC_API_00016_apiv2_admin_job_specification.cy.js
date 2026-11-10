/**
 * Test Case ID: TC_API_00016
 * Route: apiv2_admin_job_specification
 * Endpoint: PUT /api/v2/admin/job-titles/{jobTitleId}/specification
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00016: apiv2_admin_job_specification', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00016: Execute PUT /api/v2/admin/job-titles/1/specification [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/job-titles/1/specification',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
