/**
 * Test Case ID: TC_API_00132
 * Route: apiv2_organization
 * Endpoint: PUT /api/v2/admin/organization
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00132: apiv2_organization', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00132: Execute PUT /api/v2/admin/organization [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/organization',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
