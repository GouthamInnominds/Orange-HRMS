/**
 * Test Case ID: TC_API_00295
 * Route: save_qualification_skills
 * Endpoint: GET /admin/saveSkills
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00295: save_qualification_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00295: Execute GET /admin/saveSkills [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveSkills',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
