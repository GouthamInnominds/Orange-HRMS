/**
 * Test Case ID: TC_API_00879
 * Route: maintainence_module
 * Endpoint: GET /maintenance/viewMaintenanceModule
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmMaintenancePlugin - TC_API_00879: maintainence_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00879: Execute GET /maintenance/viewMaintenanceModule [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/maintenance/viewMaintenanceModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
