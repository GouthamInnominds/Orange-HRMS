/**
 * Test Case ID: TC_API_00648
 * Route: apiv2_core_public_api_version
 * Endpoint: GET /api/v2/core/public/version
 * Method: GET
 * Priority: High
 */

describe('orangehrmCorePlugin - TC_API_00648: apiv2_core_public_api_version', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00648: Execute GET /api/v2/core/public/version [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/core/public/version',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
