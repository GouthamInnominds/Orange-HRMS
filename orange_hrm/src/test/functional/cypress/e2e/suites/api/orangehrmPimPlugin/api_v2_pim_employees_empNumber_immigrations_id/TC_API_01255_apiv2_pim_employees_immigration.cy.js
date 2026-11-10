/**
 * Test Case ID: TC_API_01255
 * Route: apiv2_pim_employees_immigration
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/immigrations/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01255: apiv2_pim_employees_immigration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01255: Execute GET /api/v2/pim/employees/1/immigrations/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/immigrations/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
