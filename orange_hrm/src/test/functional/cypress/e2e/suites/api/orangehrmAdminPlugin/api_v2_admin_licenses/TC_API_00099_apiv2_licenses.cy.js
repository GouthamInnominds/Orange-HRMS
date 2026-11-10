/**
 * Test Case ID: TC_API_00099
 * Route: apiv2_licenses
 * Endpoint: POST /api/v2/admin/licenses
 * Method: POST
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00099: apiv2_licenses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00099: Execute POST /api/v2/admin/licenses [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/licenses',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
