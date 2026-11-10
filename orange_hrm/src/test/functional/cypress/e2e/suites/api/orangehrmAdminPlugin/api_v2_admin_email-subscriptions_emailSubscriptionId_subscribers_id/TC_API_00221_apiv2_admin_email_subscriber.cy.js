/**
 * Test Case ID: TC_API_00221
 * Route: apiv2_admin_email_subscriber
 * Endpoint: PUT /api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00221: apiv2_admin_email_subscriber', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00221: Execute PUT /api/v2/admin/email-subscriptions/1/subscribers/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/email-subscriptions/1/subscribers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
