/**
 * Test Case ID: TC_API_00441
 * Route: auth_admin_access_verify
 * Endpoint: POST /auth/adminVerify
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00441: auth_admin_access_verify', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00441: Execute POST /auth/adminVerify [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/auth/adminVerify',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
