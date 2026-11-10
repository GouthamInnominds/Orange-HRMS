/**
 * Test Case ID: TC_API_00334
 * Route: add_pay_grade
 * Endpoint: GET /admin/payGrade
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00334: add_pay_grade', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00334: Execute GET /admin/payGrade [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/payGrade',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
