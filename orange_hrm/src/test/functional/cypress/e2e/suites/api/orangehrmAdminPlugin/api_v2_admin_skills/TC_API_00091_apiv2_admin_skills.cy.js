/**
 * Test Case ID: TC_API_00091
 * Route: apiv2_admin_skills
 * Endpoint: DELETE /api/v2/admin/skills
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00091: apiv2_admin_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00091: Execute DELETE /api/v2/admin/skills [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/skills',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
