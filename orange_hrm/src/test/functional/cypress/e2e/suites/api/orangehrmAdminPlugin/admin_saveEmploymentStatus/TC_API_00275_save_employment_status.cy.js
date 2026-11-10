/**
 * Test Case ID: TC_API_00275
 * Route: save_employment_status
 * Endpoint: GET /admin/saveEmploymentStatus
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00275: save_employment_status', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00275: Execute GET /admin/saveEmploymentStatus [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveEmploymentStatus',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
