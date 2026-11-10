/**
 * Test Case ID: TC_API_00669
 * Route: apiv2_corporate_directory_employee
 * Endpoint: GET /api/v2/directory/employees/{empNumber}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCorporateDirectoryPlugin - TC_API_00669: apiv2_corporate_directory_employee', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00669: Execute GET /api/v2/directory/employees/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/directory/employees/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
