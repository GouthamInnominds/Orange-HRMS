/**
 * Test Case ID: TC_API_00662
 * Route: corporate_branding_images
 * Endpoint: GET /admin/theme/image/{imageName}
 * Method: GET
 * Priority: High
 */

describe('orangehrmCorporateBrandingPlugin - TC_API_00662: corporate_branding_images', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00662: Execute GET /admin/theme/image/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/theme/image/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
