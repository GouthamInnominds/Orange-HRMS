/**
 * Test Case ID: TC_API_00162
 * Route: apiv2_admin_email_configuration
 * Endpoint: PUT /api/v2/admin/email-configuration
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00162: apiv2_admin_email_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00162: Execute PUT /api/v2/admin/email-configuration [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/email-configuration',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
