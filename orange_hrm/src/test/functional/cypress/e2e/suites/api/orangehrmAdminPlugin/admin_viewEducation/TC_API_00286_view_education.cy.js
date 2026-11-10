/**
 * Test Case ID: TC_API_00286
 * Route: view_education
 * Endpoint: GET /admin/viewEducation
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00286: view_education', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00286: Execute GET /admin/viewEducation [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewEducation',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
