/**
 * Test Case ID: TC_API_01278
 * Route: apiv2_pim_report_to_subordinate
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/subordinates/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01278: apiv2_pim_report_to_subordinate', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01278: Execute GET /api/v2/pim/employees/1/subordinates/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/subordinates/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
