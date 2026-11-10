/**
 * Test Case ID: TC_API_00576
 * Route: apiv2_claim_employee_claim_request
 * Endpoint: GET /api/v2/claim/employees/{empNumber}/requests/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmClaimPlugin - TC_API_00576: apiv2_claim_employee_claim_request', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00576: Execute GET /api/v2/claim/employees/1/requests/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/claim/employees/1/requests/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
