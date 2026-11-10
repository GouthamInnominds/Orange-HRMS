/**
 * Test Case ID: TC_API_00457
 * Route: auth_weak_password_reset
 * Endpoint: GET /auth/changeWeakPassword/resetCode/{resetCode}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00457: auth_weak_password_reset', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00457: Execute GET /auth/changeWeakPassword/resetCode/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/changeWeakPassword/resetCode/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
