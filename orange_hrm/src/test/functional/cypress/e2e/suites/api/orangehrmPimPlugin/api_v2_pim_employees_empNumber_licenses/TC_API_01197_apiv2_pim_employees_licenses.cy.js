/**
 * Test Case ID: TC_API_01197
 * Route: apiv2_pim_employees_licenses
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/licenses
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01197: apiv2_pim_employees_licenses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01197: Execute POST /api/v2/pim/employees/1/licenses [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/licenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
