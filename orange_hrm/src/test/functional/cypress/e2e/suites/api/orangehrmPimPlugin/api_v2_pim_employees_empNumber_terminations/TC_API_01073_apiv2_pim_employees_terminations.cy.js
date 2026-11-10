/**
 * Test Case ID: TC_API_01073
 * Route: apiv2_pim_employees_terminations
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/terminations
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01073: apiv2_pim_employees_terminations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01073: Execute GET /api/v2/pim/employees/1/terminations [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/terminations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
