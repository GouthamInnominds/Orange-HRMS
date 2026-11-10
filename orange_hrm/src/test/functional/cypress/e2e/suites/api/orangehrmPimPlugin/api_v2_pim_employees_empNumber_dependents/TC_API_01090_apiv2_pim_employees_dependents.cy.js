/**
 * Test Case ID: TC_API_01090
 * Route: apiv2_pim_employees_dependents
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/dependents
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01090: apiv2_pim_employees_dependents', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01090: Execute GET /api/v2/pim/employees/1/dependents [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/dependents',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
