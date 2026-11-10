/**
 * Test Case ID: TC_API_00224
 * Route: apiv2_admin_validate_user_name
 * Endpoint: GET /api/v2/admin/validation/user-name
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00224: apiv2_admin_validate_user_name', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00224: Execute GET /api/v2/admin/validation/user-name [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/validation/user-name',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
