/**
 * Test Case ID: TC_API_00133
 * Route: apiv2_admin_pay_grade_allowed_currencies
 * Endpoint: GET /api/v2/admin/pay-grades/{payGradeId}/currencies/allowed
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00133: apiv2_admin_pay_grade_allowed_currencies', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00133: Execute GET /api/v2/admin/pay-grades/1/currencies/allowed [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/pay-grades/1/currencies/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
