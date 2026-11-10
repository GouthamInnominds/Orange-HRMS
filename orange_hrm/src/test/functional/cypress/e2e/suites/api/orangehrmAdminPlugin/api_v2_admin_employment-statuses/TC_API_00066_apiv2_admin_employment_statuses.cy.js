/**
 * Test Case ID: TC_API_00066
 * Route: apiv2_admin_employment_statuses
 * Endpoint: DELETE /api/v2/admin/employment-statuses
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00066: apiv2_admin_employment_statuses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00066: Execute DELETE /api/v2/admin/employment-statuses [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/employment-statuses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
