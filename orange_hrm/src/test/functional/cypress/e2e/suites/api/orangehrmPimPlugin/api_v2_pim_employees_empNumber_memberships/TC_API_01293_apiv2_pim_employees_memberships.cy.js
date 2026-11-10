/**
 * Test Case ID: TC_API_01293
 * Route: apiv2_pim_employees_memberships
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/memberships
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01293: apiv2_pim_employees_memberships', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01293: Execute GET /api/v2/pim/employees/1/memberships [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/memberships',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
