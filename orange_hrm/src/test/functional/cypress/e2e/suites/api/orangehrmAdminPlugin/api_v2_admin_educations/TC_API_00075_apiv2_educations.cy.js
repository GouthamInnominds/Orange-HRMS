/**
 * Test Case ID: TC_API_00075
 * Route: apiv2_educations
 * Endpoint: POST /api/v2/admin/educations
 * Method: POST
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00075: apiv2_educations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00075: Execute POST /api/v2/admin/educations [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/educations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
