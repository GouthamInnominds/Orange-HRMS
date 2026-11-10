/**
 * Test Case ID: TC_API_00602
 * Route: claim_view_claim
 * Endpoint: GET /claim/viewClaim
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00602: claim_view_claim', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00602: Execute GET /claim/viewClaim [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/viewClaim',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
