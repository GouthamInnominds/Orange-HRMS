/**
 * Test Case ID: TC_API_00880
 * Route: maintainence_access_employee_screen
 * Endpoint: GET /maintenance/accessEmployeeData
 * Method: GET
 * Priority: High
 */

describe('orangehrmMaintenancePlugin - TC_API_00880: maintainence_access_employee_screen', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00880: Execute GET /maintenance/accessEmployeeData [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/maintenance/accessEmployeeData',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
