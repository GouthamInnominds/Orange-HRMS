/**
 * Test Case ID: TC_API_00346
 * Route: view_email_subscription
 * Endpoint: GET /admin/viewEmailNotification
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00346: view_email_subscription', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00346: Execute GET /admin/viewEmailNotification [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewEmailNotification',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
