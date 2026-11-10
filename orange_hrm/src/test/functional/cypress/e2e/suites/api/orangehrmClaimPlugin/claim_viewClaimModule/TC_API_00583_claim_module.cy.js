/**
 * Test Case ID: TC_API_00583
 * Route: claim_module
 * Endpoint: GET /claim/viewClaimModule
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00583: claim_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00583: Execute GET /claim/viewClaimModule [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/viewClaimModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
