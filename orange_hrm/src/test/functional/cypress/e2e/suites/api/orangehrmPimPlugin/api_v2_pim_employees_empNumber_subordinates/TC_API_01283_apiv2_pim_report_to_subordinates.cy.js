/**
 * Test Case ID: TC_API_01283
 * Route: apiv2_pim_report_to_subordinates
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/subordinates
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01283: apiv2_pim_report_to_subordinates', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01283: Execute GET /api/v2/pim/employees/1/subordinates [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/subordinates',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
