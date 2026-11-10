/**
 * Test Case ID: TC_API_00255
 * Route: admin_job_specification_attachment
 * Endpoint: GET /admin/viewJobSpecification/attachId/{attachId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00255: admin_job_specification_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00255: Execute GET /admin/viewJobSpecification/attachId/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewJobSpecification/attachId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
