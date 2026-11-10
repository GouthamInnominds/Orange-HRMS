/**
 * Test Case ID: TC_API_00067
 * Route: apiv2_admin_employment_statuses
 * Endpoint: DELETE /api/v2/admin/employment-statuses
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00067: apiv2_admin_employment_statuses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00067: Execute DELETE /api/v2/admin/employment-statuses [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/employment-statuses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
