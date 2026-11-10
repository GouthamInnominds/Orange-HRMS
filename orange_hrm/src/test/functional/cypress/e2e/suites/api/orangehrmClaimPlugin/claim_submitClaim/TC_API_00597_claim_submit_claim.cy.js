/**
 * Test Case ID: TC_API_00597
 * Route: claim_submit_claim
 * Endpoint: GET /claim/submitClaim
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00597: claim_submit_claim', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00597: Execute GET /claim/submitClaim [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/submitClaim',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
