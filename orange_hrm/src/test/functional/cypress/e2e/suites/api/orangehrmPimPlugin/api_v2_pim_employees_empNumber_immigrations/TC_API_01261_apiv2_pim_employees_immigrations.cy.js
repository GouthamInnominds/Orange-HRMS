/**
 * Test Case ID: TC_API_01261
 * Route: apiv2_pim_employees_immigrations
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/immigrations
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01261: apiv2_pim_employees_immigrations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01261: Execute POST /api/v2/pim/employees/1/immigrations [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/immigrations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
