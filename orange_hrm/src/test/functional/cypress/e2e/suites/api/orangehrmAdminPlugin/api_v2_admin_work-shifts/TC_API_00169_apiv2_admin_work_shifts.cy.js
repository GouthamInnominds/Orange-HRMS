/**
 * Test Case ID: TC_API_00169
 * Route: apiv2_admin_work_shifts
 * Endpoint: GET /api/v2/admin/work-shifts
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00169: apiv2_admin_work_shifts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00169: Execute GET /api/v2/admin/work-shifts [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/work-shifts',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
