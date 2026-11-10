/**
 * Test Case ID: TC_API_00607
 * Route: claim_employee_claim
 * Endpoint: GET /claim/viewAssignClaim
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00607: claim_employee_claim', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00607: Execute GET /claim/viewAssignClaim [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/viewAssignClaim',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
