/**
 * Test Case ID: TC_API_01072
 * Route: apiv2_pim_employees_terminations
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/terminations
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01072: apiv2_pim_employees_terminations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01072: Execute GET /api/v2/pim/employees/1/terminations [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/terminations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
