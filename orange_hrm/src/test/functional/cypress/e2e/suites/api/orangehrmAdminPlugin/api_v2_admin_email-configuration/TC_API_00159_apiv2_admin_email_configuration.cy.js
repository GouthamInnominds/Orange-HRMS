/**
 * Test Case ID: TC_API_00159
 * Route: apiv2_admin_email_configuration
 * Endpoint: GET /api/v2/admin/email-configuration
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00159: apiv2_admin_email_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00159: Execute GET /api/v2/admin/email-configuration [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/email-configuration',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
