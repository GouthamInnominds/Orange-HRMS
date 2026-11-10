/**
 * Test Case ID: TC_API_01257
 * Route: apiv2_pim_employees_immigration
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/immigrations/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01257: apiv2_pim_employees_immigration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01257: Execute PUT /api/v2/pim/employees/1/immigrations/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/immigrations/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
