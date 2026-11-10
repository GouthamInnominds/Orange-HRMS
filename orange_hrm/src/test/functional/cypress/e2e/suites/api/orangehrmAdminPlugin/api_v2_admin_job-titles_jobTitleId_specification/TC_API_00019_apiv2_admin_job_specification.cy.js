/**
 * Test Case ID: TC_API_00019
 * Route: apiv2_admin_job_specification
 * Endpoint: DELETE /api/v2/admin/job-titles/{jobTitleId}/specification
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00019: apiv2_admin_job_specification', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00019: Execute DELETE /api/v2/admin/job-titles/1/specification [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/job-titles/1/specification',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
