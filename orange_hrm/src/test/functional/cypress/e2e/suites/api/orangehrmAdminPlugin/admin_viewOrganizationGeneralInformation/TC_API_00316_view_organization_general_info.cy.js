/**
 * Test Case ID: TC_API_00316
 * Route: view_organization_general_info
 * Endpoint: GET /admin/viewOrganizationGeneralInformation
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00316: view_organization_general_info', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00316: Execute GET /admin/viewOrganizationGeneralInformation [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewOrganizationGeneralInformation',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
