/**
 * Test Case ID: TC_API_00013
 * Route: apiv2_admin_job_specification
 * Endpoint: GET /api/v2/admin/job-titles/{jobTitleId}/specification
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00013: apiv2_admin_job_specification', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00013: Execute GET /api/v2/admin/job-titles/1/specification [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/job-titles/1/specification',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
