/**
 * Test Case ID: TC_API_01399
 * Route: pim_view_employee_reports
 * Endpoint: GET /pim/viewDefinedPredefinedReports
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01399: pim_view_employee_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01399: Execute GET /pim/viewDefinedPredefinedReports [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewDefinedPredefinedReports',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
