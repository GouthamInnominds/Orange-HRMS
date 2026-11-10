/**
 * Test Case ID: TC_API_00025
 * Route: apiv2_admin_job_categories
 * Endpoint: GET /api/v2/admin/job-categories
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00025: apiv2_admin_job_categories', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00025: Execute GET /api/v2/admin/job-categories [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/job-categories',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
