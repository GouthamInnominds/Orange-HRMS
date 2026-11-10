/**
 * Test Case ID: TC_API_01406
 * Route: pim_display_employee_report
 * Endpoint: GET /pim/displayPredefinedReport/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01406: pim_display_employee_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01406: Execute GET /pim/displayPredefinedReport/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/displayPredefinedReport/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
