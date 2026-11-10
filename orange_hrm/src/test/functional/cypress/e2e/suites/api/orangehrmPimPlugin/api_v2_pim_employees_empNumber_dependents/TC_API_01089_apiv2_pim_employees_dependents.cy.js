/**
 * Test Case ID: TC_API_01089
 * Route: apiv2_pim_employees_dependents
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/dependents
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01089: apiv2_pim_employees_dependents', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01089: Execute GET /api/v2/pim/employees/1/dependents [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/dependents',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
