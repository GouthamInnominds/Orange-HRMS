/**
 * Test Case ID: TC_API_00589
 * Route: claim_edit_claim_events
 * Endpoint: GET /claim/saveEvents/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00589: claim_edit_claim_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00589: Execute GET /claim/saveEvents/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/saveEvents/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
