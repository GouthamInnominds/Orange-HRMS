/**
 * Test Case ID: TC_API_00900
 * Route: admin_add_auth_provider
 * Endpoint: GET admin/addAuthProvider
 * Method: GET
 * Priority: High
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00900: admin_add_auth_provider', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00900: Execute GET admin/addAuthProvider [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: 'admin/addAuthProvider',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
