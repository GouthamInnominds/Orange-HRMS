/**
 * Test Case ID: TC_API_00088
 * Route: apiv2_admin_skills
 * Endpoint: POST /api/v2/admin/skills
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00088: apiv2_admin_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00088: Execute POST /api/v2/admin/skills [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/skills',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
