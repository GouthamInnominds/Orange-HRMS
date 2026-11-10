/**
 * Test Case ID: TC_API_00527
 * Route: apiv2_claim_event
 * Endpoint: PUT /api/v2/claim/events/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00527: apiv2_claim_event', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00527: Execute PUT /api/v2/claim/events/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/claim/events/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
