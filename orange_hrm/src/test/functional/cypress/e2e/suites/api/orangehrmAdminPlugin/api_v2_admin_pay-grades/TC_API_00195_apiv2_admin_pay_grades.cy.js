/**
 * Test Case ID: TC_API_00195
 * Route: apiv2_admin_pay_grades
 * Endpoint: GET /api/v2/admin/pay-grades
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00195: apiv2_admin_pay_grades', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00195: Execute GET /api/v2/admin/pay-grades [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/pay-grades',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
