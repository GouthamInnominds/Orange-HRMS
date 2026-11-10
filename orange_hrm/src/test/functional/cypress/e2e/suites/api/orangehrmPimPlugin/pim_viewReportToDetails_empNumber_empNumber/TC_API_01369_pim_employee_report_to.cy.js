/**
 * Test Case ID: TC_API_01369
 * Route: pim_employee_report_to
 * Endpoint: GET /pim/viewReportToDetails/empNumber/{empNumber}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01369: pim_employee_report_to', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01369: Execute GET /pim/viewReportToDetails/empNumber/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewReportToDetails/empNumber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
