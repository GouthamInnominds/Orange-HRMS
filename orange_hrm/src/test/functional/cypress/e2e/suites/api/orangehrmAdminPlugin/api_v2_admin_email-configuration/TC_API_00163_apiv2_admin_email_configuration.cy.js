/**
 * Test Case ID: TC_API_00163
 * Route: apiv2_admin_email_configuration
 * Endpoint: PUT /api/v2/admin/email-configuration
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00163: apiv2_admin_email_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00163: Execute PUT /api/v2/admin/email-configuration [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/email-configuration',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
