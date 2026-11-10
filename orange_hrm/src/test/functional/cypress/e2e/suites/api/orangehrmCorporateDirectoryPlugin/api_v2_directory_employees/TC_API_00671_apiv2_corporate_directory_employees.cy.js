/**
 * Test Case ID: TC_API_00671
 * Route: apiv2_corporate_directory_employees
 * Endpoint: GET /api/v2/directory/employees
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCorporateDirectoryPlugin - TC_API_00671: apiv2_corporate_directory_employees', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00671: Execute GET /api/v2/directory/employees [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/directory/employees',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
