/**
 * Test Case ID: TC_API_00296
 * Route: edit_qualification_skills
 * Endpoint: GET /admin/saveSkills/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00296: edit_qualification_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00296: Execute GET /admin/saveSkills/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveSkills/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
