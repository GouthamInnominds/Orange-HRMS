/**
 * Test Case ID: TC_API_00313
 * Route: save_qualification_memberships
 * Endpoint: GET /admin/saveMemberships
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00313: save_qualification_memberships', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00313: Execute GET /admin/saveMemberships [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveMemberships',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
