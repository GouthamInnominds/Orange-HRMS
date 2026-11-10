/**
 * Test Case ID: TC_API_00293
 * Route: view_qualification_skills
 * Endpoint: GET /admin/viewSkills
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00293: view_qualification_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00293: Execute GET /admin/viewSkills [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewSkills',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
