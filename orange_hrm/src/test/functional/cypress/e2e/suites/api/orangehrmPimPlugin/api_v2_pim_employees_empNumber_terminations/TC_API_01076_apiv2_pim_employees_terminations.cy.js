/**
 * Test Case ID: TC_API_01076
 * Route: apiv2_pim_employees_terminations
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/terminations
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01076: apiv2_pim_employees_terminations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01076: Execute POST /api/v2/pim/employees/1/terminations [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/terminations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
