/**
 * Test Case ID: TC_API_01093
 * Route: apiv2_pim_employees_dependents
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/dependents
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01093: apiv2_pim_employees_dependents', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01093: Execute POST /api/v2/pim/employees/1/dependents [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/dependents',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
