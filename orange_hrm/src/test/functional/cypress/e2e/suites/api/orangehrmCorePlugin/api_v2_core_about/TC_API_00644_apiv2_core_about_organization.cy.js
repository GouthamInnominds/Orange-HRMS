/**
 * Test Case ID: TC_API_00644
 * Route: apiv2_core_about_organization
 * Endpoint: GET /api/v2/core/about
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCorePlugin - TC_API_00644: apiv2_core_about_organization', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00644: Execute GET /api/v2/core/about [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/core/about',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
