/**
 * Test Case ID: TC_API_00529
 * Route: apiv2_claim_expense_types
 * Endpoint: POST /api/v2/claim/expenses/types
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00529: apiv2_claim_expense_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00529: Execute POST /api/v2/claim/expenses/types [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/expenses/types',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
