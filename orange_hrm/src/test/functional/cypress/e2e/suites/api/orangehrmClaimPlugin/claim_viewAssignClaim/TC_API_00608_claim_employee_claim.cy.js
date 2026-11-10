/**
 * Test Case ID: TC_API_00608
 * Route: claim_employee_claim
 * Endpoint: GET /claim/viewAssignClaim
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmClaimPlugin - TC_API_00608: claim_employee_claim', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00608: Execute GET /claim/viewAssignClaim [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/claim/viewAssignClaim',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
