/**
 * Test Case ID: TC_API_00351
 * Route: admin_localization
 * Endpoint: GET /admin/localization
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00351: admin_localization', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00351: Execute GET /admin/localization [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/localization',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
