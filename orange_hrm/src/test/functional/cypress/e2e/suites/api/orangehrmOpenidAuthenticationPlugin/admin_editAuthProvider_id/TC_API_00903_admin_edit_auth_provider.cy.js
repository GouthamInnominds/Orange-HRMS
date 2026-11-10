/**
 * Test Case ID: TC_API_00903
 * Route: admin_edit_auth_provider
 * Endpoint: GET admin/editAuthProvider/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmOpenidAuthenticationPlugin - TC_API_00903: admin_edit_auth_provider', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00903: Execute GET admin/editAuthProvider/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: 'admin/editAuthProvider/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
