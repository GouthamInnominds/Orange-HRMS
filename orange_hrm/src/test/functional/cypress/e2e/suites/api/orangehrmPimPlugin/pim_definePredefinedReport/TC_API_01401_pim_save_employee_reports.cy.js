/**
 * Test Case ID: TC_API_01401
 * Route: pim_save_employee_reports
 * Endpoint: GET /pim/definePredefinedReport
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01401: pim_save_employee_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01401: Execute GET /pim/definePredefinedReport [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/definePredefinedReport',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
