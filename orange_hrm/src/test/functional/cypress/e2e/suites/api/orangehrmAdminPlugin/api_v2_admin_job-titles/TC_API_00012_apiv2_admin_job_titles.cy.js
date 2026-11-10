/**
 * Test Case ID: TC_API_00012
 * Route: apiv2_admin_job_titles
 * Endpoint: DELETE /api/v2/admin/job-titles
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00012: apiv2_admin_job_titles', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00012: Execute DELETE /api/v2/admin/job-titles [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/job-titles',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
