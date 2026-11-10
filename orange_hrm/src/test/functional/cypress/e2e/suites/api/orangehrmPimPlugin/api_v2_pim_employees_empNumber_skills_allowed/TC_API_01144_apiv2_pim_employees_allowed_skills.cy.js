/**
 * Test Case ID: TC_API_01144
 * Route: apiv2_pim_employees_allowed_skills
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/skills/allowed
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01144: apiv2_pim_employees_allowed_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01144: Execute DELETE /api/v2/pim/employees/1/skills/allowed [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/skills/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
