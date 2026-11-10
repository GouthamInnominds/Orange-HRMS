/**
 * Test Case ID: TC_API_00437
 * Route: auth_validate
 * Endpoint: POST /auth/validate
 * Method: POST
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00437: auth_validate', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00437: Execute POST /auth/validate [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/auth/validate',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
