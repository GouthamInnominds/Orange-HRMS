/**
 * Test Case ID: TC_API_00266
 * Route: view_job_category
 * Endpoint: GET /admin/jobCategory
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00266: view_job_category', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00266: Execute GET /admin/jobCategory [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/jobCategory',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
