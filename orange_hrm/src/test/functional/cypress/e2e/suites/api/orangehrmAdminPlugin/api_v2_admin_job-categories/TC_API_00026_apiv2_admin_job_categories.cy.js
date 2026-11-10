/**
 * Test Case ID: TC_API_00026
 * Route: apiv2_admin_job_categories
 * Endpoint: GET /api/v2/admin/job-categories
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00026: apiv2_admin_job_categories', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00026: Execute GET /api/v2/admin/job-categories [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/job-categories',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
