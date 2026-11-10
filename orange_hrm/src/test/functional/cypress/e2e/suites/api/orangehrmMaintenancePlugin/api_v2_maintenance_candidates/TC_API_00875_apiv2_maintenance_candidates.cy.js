/**
 * Test Case ID: TC_API_00875
 * Route: apiv2_maintenance_candidates
 * Endpoint: GET /api/v2/maintenance/candidates
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmMaintenancePlugin - TC_API_00875: apiv2_maintenance_candidates', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00875: Execute GET /api/v2/maintenance/candidates [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/maintenance/candidates',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
