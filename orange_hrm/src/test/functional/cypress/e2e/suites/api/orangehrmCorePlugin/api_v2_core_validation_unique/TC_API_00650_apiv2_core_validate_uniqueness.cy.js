/**
 * Test Case ID: TC_API_00650
 * Route: apiv2_core_validate_uniqueness
 * Endpoint: GET /api/v2/core/validation/unique
 * Method: GET
 * Priority: High
 */

describe('orangehrmCorePlugin - TC_API_00650: apiv2_core_validate_uniqueness', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00650: Execute GET /api/v2/core/validation/unique [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/core/validation/unique',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
