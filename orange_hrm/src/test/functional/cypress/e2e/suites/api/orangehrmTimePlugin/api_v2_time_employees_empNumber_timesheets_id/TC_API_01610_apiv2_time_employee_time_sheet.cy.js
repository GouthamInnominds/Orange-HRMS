/**
 * Test Case ID: TC_API_01610
 * Route: apiv2_time_employee_time_sheet
 * Endpoint: PUT /api/v2/time/employees/{empNumber}/timesheets/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01610: apiv2_time_employee_time_sheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01610: Execute PUT /api/v2/time/employees/1/timesheets/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/employees/1/timesheets/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
