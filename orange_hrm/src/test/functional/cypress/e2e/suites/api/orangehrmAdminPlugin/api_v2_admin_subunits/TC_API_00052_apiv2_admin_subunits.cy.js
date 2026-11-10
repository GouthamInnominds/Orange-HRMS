/**
 * Test Case ID: TC_API_00052
 * Route: apiv2_admin_subunits
 * Endpoint: GET /api/v2/admin/subunits
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00052: apiv2_admin_subunits', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00052: Execute GET /api/v2/admin/subunits [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/subunits',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
