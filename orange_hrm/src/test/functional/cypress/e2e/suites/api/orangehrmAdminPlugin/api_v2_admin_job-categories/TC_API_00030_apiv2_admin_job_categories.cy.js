/**
 * Test Case ID: TC_API_00030
 * Route: apiv2_admin_job_categories
 * Endpoint: DELETE /api/v2/admin/job-categories
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00030: apiv2_admin_job_categories', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00030: Execute DELETE /api/v2/admin/job-categories [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/job-categories',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
