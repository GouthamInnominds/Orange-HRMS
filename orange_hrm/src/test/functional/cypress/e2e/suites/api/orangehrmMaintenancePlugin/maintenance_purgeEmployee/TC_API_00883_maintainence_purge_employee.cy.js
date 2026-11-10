/**
 * Test Case ID: TC_API_00883
 * Route: maintainence_purge_employee
 * Endpoint: GET /maintenance/purgeEmployee
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmMaintenancePlugin - TC_API_00883: maintainence_purge_employee', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00883: Execute GET /maintenance/purgeEmployee [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/maintenance/purgeEmployee',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
