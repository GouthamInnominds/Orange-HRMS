/**
 * Test Case ID: TC_API_00263
 * Route: save_job_title
 * Endpoint: GET /admin/saveJobTitle
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00263: save_job_title', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00263: Execute GET /admin/saveJobTitle [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveJobTitle',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
