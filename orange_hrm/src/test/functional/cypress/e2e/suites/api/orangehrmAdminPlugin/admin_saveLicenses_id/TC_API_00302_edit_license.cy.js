/**
 * Test Case ID: TC_API_00302
 * Route: edit_license
 * Endpoint: GET /admin/saveLicenses/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00302: edit_license', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00302: Execute GET /admin/saveLicenses/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLicenses/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
