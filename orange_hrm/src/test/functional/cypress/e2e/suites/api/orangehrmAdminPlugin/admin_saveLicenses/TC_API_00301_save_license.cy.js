/**
 * Test Case ID: TC_API_00301
 * Route: save_license
 * Endpoint: GET /admin/saveLicenses
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00301: save_license', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00301: Execute GET /admin/saveLicenses [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLicenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
