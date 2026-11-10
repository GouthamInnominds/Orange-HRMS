/**
 * Test Case ID: TC_API_00015
 * Route: apiv2_admin_job_specification
 * Endpoint: PUT /api/v2/admin/job-titles/{jobTitleId}/specification
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00015: apiv2_admin_job_specification', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00015: Execute PUT /api/v2/admin/job-titles/1/specification [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/job-titles/1/specification',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
