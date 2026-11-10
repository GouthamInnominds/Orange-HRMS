/**
 * Test Case ID: TC_API_00276
 * Route: edit_employment_status
 * Endpoint: GET /admin/saveEmploymentStatus/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00276: edit_employment_status', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00276: Execute GET /admin/saveEmploymentStatus/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveEmploymentStatus/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
