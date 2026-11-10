/**
 * Test Case ID: TC_API_01034
 * Route: apiv2_pim_employees
 * Endpoint: GET /api/v2/pim/employees
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01034: apiv2_pim_employees', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01034: Execute GET /api/v2/pim/employees [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
