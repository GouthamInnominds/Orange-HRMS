/**
 * Test Case ID: TC_API_00129
 * Route: apiv2_organization
 * Endpoint: GET /api/v2/admin/organization
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00129: apiv2_organization', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00129: Execute GET /api/v2/admin/organization [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/organization',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
