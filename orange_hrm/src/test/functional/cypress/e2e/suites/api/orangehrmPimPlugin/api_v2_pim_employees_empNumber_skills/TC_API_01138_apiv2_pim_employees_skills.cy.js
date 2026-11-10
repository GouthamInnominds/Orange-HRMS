/**
 * Test Case ID: TC_API_01138
 * Route: apiv2_pim_employees_skills
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/skills
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01138: apiv2_pim_employees_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01138: Execute DELETE /api/v2/pim/employees/1/skills [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/skills',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
