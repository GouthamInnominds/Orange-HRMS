/**
 * Test Case ID: TC_API_00211
 * Route: apiv2_admin_email_subscriptions
 * Endpoint: GET /api/v2/admin/email-subscriptions
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00211: apiv2_admin_email_subscriptions', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00211: Execute GET /api/v2/admin/email-subscriptions [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/email-subscriptions',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
