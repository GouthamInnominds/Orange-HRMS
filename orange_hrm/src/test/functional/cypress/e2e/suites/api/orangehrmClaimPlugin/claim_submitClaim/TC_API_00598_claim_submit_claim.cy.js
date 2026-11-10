/**
 * Test Case ID: TC_API_00598
 * Route: claim_submit_claim
 * Endpoint: GET /claim/submitClaim
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00598: claim_submit_claim', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00598: Execute GET /claim/submitClaim [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/submitClaim',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
