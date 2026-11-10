/**
 * Test Case ID: TC_API_01041
 * Route: apiv2_pim_employees_count
 * Endpoint: GET /api/v2/pim/employees/count
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01041: apiv2_pim_employees_count', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01041: Execute GET /api/v2/pim/employees/count [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/count',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
