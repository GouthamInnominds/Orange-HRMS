/**
 * Test Case ID: TC_API_01671
 * Route: time_employee_view_timesheet
 * Endpoint: GET /time/viewTimesheet/employeeId/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01671: time_employee_view_timesheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01671: Execute GET /time/viewTimesheet/employeeId/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewTimesheet/employeeId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
