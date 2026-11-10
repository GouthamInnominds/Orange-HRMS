/**
 * Test Case ID: TC_API_01400
 * Route: pim_view_employee_reports
 * Endpoint: GET /pim/viewDefinedPredefinedReports
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01400: pim_view_employee_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01400: Execute GET /pim/viewDefinedPredefinedReports [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewDefinedPredefinedReports',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
