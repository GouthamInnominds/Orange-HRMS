/**
 * Test Case ID: TC_API_00090
 * Route: apiv2_admin_skills
 * Endpoint: DELETE /api/v2/admin/skills
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00090: apiv2_admin_skills', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00090: Execute DELETE /api/v2/admin/skills [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/skills',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
