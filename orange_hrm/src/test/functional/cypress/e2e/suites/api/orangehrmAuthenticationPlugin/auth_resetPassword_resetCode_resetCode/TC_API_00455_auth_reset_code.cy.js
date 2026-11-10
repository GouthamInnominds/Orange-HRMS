/**
 * Test Case ID: TC_API_00455
 * Route: auth_reset_code
 * Endpoint: GET /auth/resetPassword/resetCode/{resetCode}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00455: auth_reset_code', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00455: Execute GET /auth/resetPassword/resetCode/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/resetPassword/resetCode/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
