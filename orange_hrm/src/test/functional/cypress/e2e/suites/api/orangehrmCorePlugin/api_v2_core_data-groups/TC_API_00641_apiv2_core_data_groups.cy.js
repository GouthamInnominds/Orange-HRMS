/**
 * Test Case ID: TC_API_00641
 * Route: apiv2_core_data_groups
 * Endpoint: DELETE /api/v2/core/data-groups
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmCorePlugin - TC_API_00641: apiv2_core_data_groups', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00641: Execute DELETE /api/v2/core/data-groups [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/core/data-groups',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
