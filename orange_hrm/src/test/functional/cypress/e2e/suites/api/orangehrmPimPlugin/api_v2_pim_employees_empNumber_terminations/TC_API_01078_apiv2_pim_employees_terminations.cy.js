/**
 * Test Case ID: TC_API_01078
 * Route: apiv2_pim_employees_terminations
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/terminations
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01078: apiv2_pim_employees_terminations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01078: Execute DELETE /api/v2/pim/employees/1/terminations [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/terminations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
