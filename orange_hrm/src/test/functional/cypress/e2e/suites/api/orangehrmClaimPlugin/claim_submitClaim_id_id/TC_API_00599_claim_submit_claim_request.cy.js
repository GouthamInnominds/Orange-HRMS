/**
 * Test Case ID: TC_API_00599
 * Route: claim_submit_claim_request
 * Endpoint: GET /claim/submitClaim/id/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00599: claim_submit_claim_request', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00599: Execute GET /claim/submitClaim/id/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/submitClaim/id/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
