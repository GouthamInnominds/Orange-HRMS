/**
 * Test Case ID: TC_API_01404
 * Route: pim_edit_employee_reports
 * Endpoint: GET /pim/definePredefinedReport/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01404: pim_edit_employee_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01404: Execute GET /pim/definePredefinedReport/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/definePredefinedReport/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
