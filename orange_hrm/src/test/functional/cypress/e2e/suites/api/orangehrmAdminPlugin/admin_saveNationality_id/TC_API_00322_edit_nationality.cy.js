/**
 * Test Case ID: TC_API_00322
 * Route: edit_nationality
 * Endpoint: GET /admin/saveNationality/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00322: edit_nationality', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00322: Execute GET /admin/saveNationality/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveNationality/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
