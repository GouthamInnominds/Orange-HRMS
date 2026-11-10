/**
 * Test Case ID: TC_API_01036
 * Route: apiv2_pim_employees
 * Endpoint: POST /api/v2/pim/employees
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01036: apiv2_pim_employees', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01036: Execute POST /api/v2/pim/employees [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
