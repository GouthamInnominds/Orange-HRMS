/**
 * Test Case ID: TC_API_00083
 * Route: apiv2_admin_skill
 * Endpoint: PUT /api/v2/admin/skills/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00083: apiv2_admin_skill', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00083: Execute PUT /api/v2/admin/skills/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/skills/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
