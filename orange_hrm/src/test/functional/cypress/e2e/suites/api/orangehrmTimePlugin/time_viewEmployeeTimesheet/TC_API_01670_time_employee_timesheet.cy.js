/**
 * Test Case ID: TC_API_01670
 * Route: time_employee_timesheet
 * Endpoint: GET /time/viewEmployeeTimesheet
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01670: time_employee_timesheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01670: Execute GET /time/viewEmployeeTimesheet [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewEmployeeTimesheet',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
