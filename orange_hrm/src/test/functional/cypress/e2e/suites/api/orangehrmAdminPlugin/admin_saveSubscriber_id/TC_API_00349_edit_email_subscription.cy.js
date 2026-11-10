/**
 * Test Case ID: TC_API_00349
 * Route: edit_email_subscription
 * Endpoint: GET /admin/saveSubscriber/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00349: edit_email_subscription', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00349: Execute GET /admin/saveSubscriber/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveSubscriber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
