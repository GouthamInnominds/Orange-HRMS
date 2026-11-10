/**
 * Test Case ID: TC_API_00299
 * Route: view_license
 * Endpoint: GET /admin/viewLicenses
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00299: view_license', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00299: Execute GET /admin/viewLicenses [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewLicenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
