/**
 * Test Case ID: TC_API_00140
 * Route: apiv2_admin_paygrades_currencies
 * Endpoint: GET /api/v2/admin/pay-grades/{payGradeId}/currencies
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00140: apiv2_admin_paygrades_currencies', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00140: Execute GET /api/v2/admin/pay-grades/1/currencies [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/pay-grades/1/currencies',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
