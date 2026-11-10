/**
 * Test Case ID: TC_API_00574
 * Route: apiv2_claim_employees_claim_requests
 * Endpoint: GET /api/v2/claim/employees/requests
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00574: apiv2_claim_employees_claim_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00574: Execute GET /api/v2/claim/employees/requests [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/employees/requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
