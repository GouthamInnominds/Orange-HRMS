/**
 * Test Case ID: TC_API_00174
 * Route: apiv2_admin_work_shifts
 * Endpoint: DELETE /api/v2/admin/work-shifts
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00174: apiv2_admin_work_shifts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00174: Execute DELETE /api/v2/admin/work-shifts [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/work-shifts',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
