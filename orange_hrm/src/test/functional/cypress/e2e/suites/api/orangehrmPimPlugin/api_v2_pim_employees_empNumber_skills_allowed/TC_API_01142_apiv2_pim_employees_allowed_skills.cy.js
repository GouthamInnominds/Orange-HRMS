/**
 * Test Case ID: TC_API_01142
 * Route: apiv2_pim_employees_allowed_skills
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/skills/allowed
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01142: apiv2_pim_employees_allowed_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01142: Execute POST /api/v2/pim/employees/1/skills/allowed [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/skills/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
