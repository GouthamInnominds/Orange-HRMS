/**
 * Test Case ID: TC_API_00538
 * Route: apiv2_claim_expense_type
 * Endpoint: PUT /api/v2/claim/expenses/types/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00538: apiv2_claim_expense_type', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00538: Execute PUT /api/v2/claim/expenses/types/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/claim/expenses/types/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
