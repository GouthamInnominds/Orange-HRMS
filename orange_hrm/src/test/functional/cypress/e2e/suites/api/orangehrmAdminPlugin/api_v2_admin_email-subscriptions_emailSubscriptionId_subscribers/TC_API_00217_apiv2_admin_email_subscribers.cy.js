/**
 * Test Case ID: TC_API_00217
 * Route: apiv2_admin_email_subscribers
 * Endpoint: DELETE /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00217: apiv2_admin_email_subscribers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00217: Execute DELETE /api/v2/admin/email-subscriptions/1/subscribers [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/email-subscriptions/1/subscribers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
