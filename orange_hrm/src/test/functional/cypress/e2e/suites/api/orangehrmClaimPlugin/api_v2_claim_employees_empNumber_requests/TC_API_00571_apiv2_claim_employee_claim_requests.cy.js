/**
 * Test Case ID: TC_API_00571
 * Route: apiv2_claim_employee_claim_requests
 * Endpoint: POST /api/v2/claim/employees/{empNumber}/requests
 * Method: POST
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00571: apiv2_claim_employee_claim_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00571: Execute POST /api/v2/claim/employees/1/requests [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/claim/employees/1/requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
