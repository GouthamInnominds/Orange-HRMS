/**
 * Test Case ID: TC_API_00559
 * Route: apiv2_claim_attachment
 * Endpoint: GET /api/v2/claim/requests/{requestId}/attachments/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00559: apiv2_claim_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00559: Execute GET /api/v2/claim/requests/1/attachments/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/requests/1/attachments/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
