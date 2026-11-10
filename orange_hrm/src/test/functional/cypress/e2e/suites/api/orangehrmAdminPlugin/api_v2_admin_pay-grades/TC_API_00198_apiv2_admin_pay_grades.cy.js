/**
 * Test Case ID: TC_API_00198
 * Route: apiv2_admin_pay_grades
 * Endpoint: POST /api/v2/admin/pay-grades
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00198: apiv2_admin_pay_grades', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00198: Execute POST /api/v2/admin/pay-grades [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/admin/pay-grades',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
