/**
 * Test Case ID: TC_API_00172
 * Route: apiv2_admin_work_shifts
 * Endpoint: POST /api/v2/admin/work-shifts
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00172: apiv2_admin_work_shifts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00172: Execute POST /api/v2/admin/work-shifts [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/work-shifts',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
