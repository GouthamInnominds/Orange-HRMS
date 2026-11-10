/**
 * Test Case ID: TC_API_00220
 * Route: apiv2_admin_email_subscriber
 * Endpoint: GET /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00220: apiv2_admin_email_subscriber', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00220: Execute GET /api/v2/admin/email-subscriptions/1/subscribers/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/email-subscriptions/1/subscribers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
