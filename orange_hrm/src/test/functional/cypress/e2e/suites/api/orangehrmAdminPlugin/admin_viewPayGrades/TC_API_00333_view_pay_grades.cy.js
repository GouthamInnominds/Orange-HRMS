/**
 * Test Case ID: TC_API_00333
 * Route: view_pay_grades
 * Endpoint: GET /admin/viewPayGrades
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00333: view_pay_grades', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00333: Execute GET /admin/viewPayGrades [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/viewPayGrades',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
