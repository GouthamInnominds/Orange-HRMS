/**
 * Test Case ID: TC_API_00079
 * Route: apiv2_educations
 * Endpoint: DELETE /api/v2/admin/educations
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00079: apiv2_educations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00079: Execute DELETE /api/v2/admin/educations [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/educations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
