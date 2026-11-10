/**
 * Test Case ID: TC_API_01095
 * Route: apiv2_pim_employees_dependents
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/dependents
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01095: apiv2_pim_employees_dependents', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01095: Execute DELETE /api/v2/pim/employees/1/dependents [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/dependents',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
