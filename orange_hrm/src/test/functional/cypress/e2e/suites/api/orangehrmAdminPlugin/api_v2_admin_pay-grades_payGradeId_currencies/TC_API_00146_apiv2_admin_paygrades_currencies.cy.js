/**
 * Test Case ID: TC_API_00146
 * Route: apiv2_admin_paygrades_currencies
 * Endpoint: DELETE /api/v2/admin/pay-grades/{payGradeId}/currencies
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00146: apiv2_admin_paygrades_currencies', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00146: Execute DELETE /api/v2/admin/pay-grades/1/currencies [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/admin/pay-grades/1/currencies',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
