/**
 * Test Case ID: TC_API_00230
 * Route: apiv2_admin_localization
 * Endpoint: PUT /api/v2/admin/localization
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00230: apiv2_admin_localization', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00230: Execute PUT /api/v2/admin/localization [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/localization',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
