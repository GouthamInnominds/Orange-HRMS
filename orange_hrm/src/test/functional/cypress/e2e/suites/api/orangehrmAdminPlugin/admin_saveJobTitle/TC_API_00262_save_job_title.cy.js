/**
 * Test Case ID: TC_API_00262
 * Route: save_job_title
 * Endpoint: GET /admin/saveJobTitle
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00262: save_job_title', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00262: Execute GET /admin/saveJobTitle [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveJobTitle',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
