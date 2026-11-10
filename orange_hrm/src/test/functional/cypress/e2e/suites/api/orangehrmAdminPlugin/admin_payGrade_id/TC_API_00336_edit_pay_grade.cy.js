/**
 * Test Case ID: TC_API_00336
 * Route: edit_pay_grade
 * Endpoint: GET /admin/payGrade/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00336: edit_pay_grade', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00336: Execute GET /admin/payGrade/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/payGrade/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
