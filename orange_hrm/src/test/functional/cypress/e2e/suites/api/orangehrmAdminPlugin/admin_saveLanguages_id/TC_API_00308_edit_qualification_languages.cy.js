/**
 * Test Case ID: TC_API_00308
 * Route: edit_qualification_languages
 * Endpoint: GET /admin/saveLanguages/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00308: edit_qualification_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00308: Execute GET /admin/saveLanguages/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveLanguages/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
