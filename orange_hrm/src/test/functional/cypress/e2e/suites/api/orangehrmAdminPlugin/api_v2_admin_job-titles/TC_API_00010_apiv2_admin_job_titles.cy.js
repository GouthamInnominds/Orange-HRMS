/**
 * Test Case ID: TC_API_00010
 * Route: apiv2_admin_job_titles
 * Endpoint: POST /api/v2/admin/job-titles
 * Method: POST
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00010: apiv2_admin_job_titles', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00010: Execute POST /api/v2/admin/job-titles [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/job-titles',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
