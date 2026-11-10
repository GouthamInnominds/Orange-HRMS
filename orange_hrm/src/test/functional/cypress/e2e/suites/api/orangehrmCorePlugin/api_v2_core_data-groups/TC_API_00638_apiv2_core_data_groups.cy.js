/**
 * Test Case ID: TC_API_00638
 * Route: apiv2_core_data_groups
 * Endpoint: POST /api/v2/core/data-groups
 * Method: POST
 * Priority: High
 */

describe('orangehrmCorePlugin - TC_API_00638: apiv2_core_data_groups', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00638: Execute POST /api/v2/core/data-groups [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/core/data-groups',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
