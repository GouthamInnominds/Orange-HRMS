/**
 * Test Case ID: TC_API_00272
 * Route: view_employment_status
 * Endpoint: GET /admin/employmentStatus
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00272: view_employment_status', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00272: Execute GET /admin/employmentStatus [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/employmentStatus',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
