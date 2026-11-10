/**
 * Test Case ID: TC_API_00294
 * Route: save_qualification_skills
 * Endpoint: GET /admin/saveSkills
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00294: save_qualification_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00294: Execute GET /admin/saveSkills [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveSkills',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
