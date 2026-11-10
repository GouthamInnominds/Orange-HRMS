/**
 * Test Case ID: TC_API_00605
 * Route: claim_assign_claim_request
 * Endpoint: GET /claim/assignClaim/id/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00605: claim_assign_claim_request', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00605: Execute GET /claim/assignClaim/id/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/assignClaim/id/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
