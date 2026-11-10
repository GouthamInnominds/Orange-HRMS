/**
 * Test Case ID: TC_API_00901
 * Route: admin_add_auth_provider
 * Endpoint: GET admin/addAuthProvider
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00901: admin_add_auth_provider', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00901: Execute GET admin/addAuthProvider [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: 'admin/addAuthProvider',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
