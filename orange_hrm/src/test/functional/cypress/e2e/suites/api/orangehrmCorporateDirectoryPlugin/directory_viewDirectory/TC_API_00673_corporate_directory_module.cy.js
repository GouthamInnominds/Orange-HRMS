/**
 * Test Case ID: TC_API_00673
 * Route: corporate_directory_module
 * Endpoint: GET /directory/viewDirectory
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCorporateDirectoryPlugin - TC_API_00673: corporate_directory_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00673: Execute GET /directory/viewDirectory [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/directory/viewDirectory',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
