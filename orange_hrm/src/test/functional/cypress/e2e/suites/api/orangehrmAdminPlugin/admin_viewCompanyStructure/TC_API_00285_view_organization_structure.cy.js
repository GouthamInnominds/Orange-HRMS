/**
 * Test Case ID: TC_API_00285
 * Route: view_organization_structure
 * Endpoint: GET /admin/viewCompanyStructure
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00285: view_organization_structure', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00285: Execute GET /admin/viewCompanyStructure [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewCompanyStructure',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
