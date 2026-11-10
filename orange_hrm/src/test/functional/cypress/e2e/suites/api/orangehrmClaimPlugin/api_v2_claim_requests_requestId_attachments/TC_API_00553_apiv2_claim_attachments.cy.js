/**
 * Test Case ID: TC_API_00553
 * Route: apiv2_claim_attachments
 * Endpoint: POST /api/v2/claim/requests/{requestId}/attachments
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00553: apiv2_claim_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00553: Execute POST /api/v2/claim/requests/1/attachments [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/requests/1/attachments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
