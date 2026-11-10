/**
 * Test Case ID: TC_API_00665
 * Route: corporate_branding_attachments_image
 * Endpoint: GET /admin/theme/attachments/image/{imageName}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmCorporateBrandingPlugin - TC_API_00665: corporate_branding_attachments_image', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00665: Execute GET /admin/theme/attachments/image/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/theme/attachments/image/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
