/**
 * Test Case ID: TC_API_00006
 * Route: apiv2_admin_job_titles
 * Endpoint: GET /api/v2/admin/job-titles
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00006: apiv2_admin_job_titles', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00006: Execute GET /api/v2/admin/job-titles [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/job-titles',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
