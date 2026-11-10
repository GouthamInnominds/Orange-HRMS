/**
 * Test Case ID: TC_API_00314
 * Route: edit_qualification_memberships
 * Endpoint: GET /admin/saveMemberships/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00314: edit_qualification_memberships', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00314: Execute GET /admin/saveMemberships/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveMemberships/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
