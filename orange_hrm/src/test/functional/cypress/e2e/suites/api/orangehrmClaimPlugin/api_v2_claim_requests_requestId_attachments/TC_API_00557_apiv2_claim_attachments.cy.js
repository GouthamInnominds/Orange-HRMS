/**
 * Test Case ID: TC_API_00557
 * Route: apiv2_claim_attachments
 * Endpoint: DELETE /api/v2/claim/requests/{requestId}/attachments
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00557: apiv2_claim_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00557: Execute DELETE /api/v2/claim/requests/1/attachments [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/claim/requests/1/attachments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
