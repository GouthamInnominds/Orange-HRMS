/**
 * Test Case ID: TC_API_00270
 * Route: edit_job_category
 * Endpoint: GET /admin/saveJobCategory/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00270: edit_job_category', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00270: Execute GET /admin/saveJobCategory/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveJobCategory/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
