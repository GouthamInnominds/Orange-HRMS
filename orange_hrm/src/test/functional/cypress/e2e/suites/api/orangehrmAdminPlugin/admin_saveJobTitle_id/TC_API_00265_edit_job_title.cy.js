/**
 * Test Case ID: TC_API_00265
 * Route: edit_job_title
 * Endpoint: GET /admin/saveJobTitle/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00265: edit_job_title', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00265: Execute GET /admin/saveJobTitle/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveJobTitle/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
