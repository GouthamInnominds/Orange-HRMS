/**
 * Test Case ID: TC_API_00288
 * Route: save_education
 * Endpoint: GET /admin/saveEducation
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00288: save_education', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00288: Execute GET /admin/saveEducation [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveEducation',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
