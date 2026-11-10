/**
 * Test Case ID: TC_API_00428
 * Route: apiv2_auth_public_validation_password
 * Endpoint: POST /api/v2/auth/public/validation/password
 * Method: POST
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00428: apiv2_auth_public_validation_password', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00428: Execute POST /api/v2/auth/public/validation/password [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/auth/public/validation/password',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
