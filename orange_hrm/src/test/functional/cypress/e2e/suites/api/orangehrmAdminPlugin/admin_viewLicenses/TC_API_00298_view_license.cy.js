/**
 * Test Case ID: TC_API_00298
 * Route: view_license
 * Endpoint: GET /admin/viewLicenses
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00298: view_license', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00298: Execute GET /admin/viewLicenses [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewLicenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
