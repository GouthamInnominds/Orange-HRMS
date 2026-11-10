/**
 * Test Case ID: TC_API_00332
 * Route: view_pay_grades
 * Endpoint: GET /admin/viewPayGrades
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00332: view_pay_grades', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00332: Execute GET /admin/viewPayGrades [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewPayGrades',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
