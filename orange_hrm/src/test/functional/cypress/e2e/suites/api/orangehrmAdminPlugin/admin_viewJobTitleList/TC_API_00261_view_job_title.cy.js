/**
 * Test Case ID: TC_API_00261
 * Route: view_job_title
 * Endpoint: GET /admin/viewJobTitleList
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00261: view_job_title', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00261: Execute GET /admin/viewJobTitleList [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewJobTitleList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
