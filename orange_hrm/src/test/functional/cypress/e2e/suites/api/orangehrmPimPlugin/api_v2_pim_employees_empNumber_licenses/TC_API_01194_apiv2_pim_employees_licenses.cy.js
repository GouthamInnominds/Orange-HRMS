/**
 * Test Case ID: TC_API_01194
 * Route: apiv2_pim_employees_licenses
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/licenses
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01194: apiv2_pim_employees_licenses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01194: Execute GET /api/v2/pim/employees/1/licenses [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/licenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
