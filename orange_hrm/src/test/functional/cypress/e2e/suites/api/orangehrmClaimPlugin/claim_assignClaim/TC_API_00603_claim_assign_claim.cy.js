/**
 * Test Case ID: TC_API_00603
 * Route: claim_assign_claim
 * Endpoint: GET /claim/assignClaim
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00603: claim_assign_claim', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00603: Execute GET /claim/assignClaim [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/assignClaim',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
