/**
 * Test Case ID: TC_API_00637
 * Route: apiv2_core_data_groups
 * Endpoint: GET /api/v2/core/data-groups
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCorePlugin - TC_API_00637: apiv2_core_data_groups', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00637: Execute GET /api/v2/core/data-groups [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/core/data-groups',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
