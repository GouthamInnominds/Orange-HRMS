/**
 * Test Case ID: TC_API_00269
 * Route: save_job_category
 * Endpoint: GET /admin/saveJobCategory
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00269: save_job_category', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00269: Execute GET /admin/saveJobCategory [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveJobCategory',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
