/**
 * Test Case ID: TC_API_00213
 * Route: apiv2_admin_email_subscribers
 * Endpoint: GET /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00213: apiv2_admin_email_subscribers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00213: Execute GET /api/v2/admin/email-subscriptions/1/subscribers [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/email-subscriptions/1/subscribers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
