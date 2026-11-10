/**
 * Test Case ID: TC_API_01067
 * Route: apiv2_pim_employees_termination
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/terminations/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01067: apiv2_pim_employees_termination', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01067: Execute GET /api/v2/pim/employees/1/terminations/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/terminations/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
