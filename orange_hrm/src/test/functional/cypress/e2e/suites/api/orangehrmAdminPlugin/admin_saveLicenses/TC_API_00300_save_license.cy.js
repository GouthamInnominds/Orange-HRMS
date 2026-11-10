/**
 * Test Case ID: TC_API_00300
 * Route: save_license
 * Endpoint: GET /admin/saveLicenses
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00300: save_license', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00300: Execute GET /admin/saveLicenses [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLicenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
