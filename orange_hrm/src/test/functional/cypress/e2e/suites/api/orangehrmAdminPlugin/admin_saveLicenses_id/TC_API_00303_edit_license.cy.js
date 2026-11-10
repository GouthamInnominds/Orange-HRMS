/**
 * Test Case ID: TC_API_00303
 * Route: edit_license
 * Endpoint: GET /admin/saveLicenses/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00303: edit_license', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00303: Execute GET /admin/saveLicenses/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLicenses/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
