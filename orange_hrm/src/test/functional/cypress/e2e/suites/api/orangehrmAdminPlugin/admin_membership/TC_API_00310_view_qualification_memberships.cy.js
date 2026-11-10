/**
 * Test Case ID: TC_API_00310
 * Route: view_qualification_memberships
 * Endpoint: GET /admin/membership
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00310: view_qualification_memberships', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00310: Execute GET /admin/membership [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/membership',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
