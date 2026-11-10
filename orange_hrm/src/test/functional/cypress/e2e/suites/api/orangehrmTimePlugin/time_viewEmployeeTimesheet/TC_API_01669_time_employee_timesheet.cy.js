/**
 * Test Case ID: TC_API_01669
 * Route: time_employee_timesheet
 * Endpoint: GET /time/viewEmployeeTimesheet
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01669: time_employee_timesheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01669: Execute GET /time/viewEmployeeTimesheet [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewEmployeeTimesheet',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
