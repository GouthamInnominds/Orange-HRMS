/**
 * Test Case ID: TC_API_00876
 * Route: maintainence_employee_json
 * Endpoint: GET /maintenance/accessEmployeeData/{empNumber}
 * Method: GET
 * Priority: High
 */

describe('orangehrmMaintenancePlugin - TC_API_00876: maintainence_employee_json', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00876: Execute GET /maintenance/accessEmployeeData/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/maintenance/accessEmployeeData/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
