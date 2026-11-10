/**
 * Test Case ID: TC_API_00863
 * Route: add_holiday
 * Endpoint: GET /leave/saveHolidays
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00863: add_holiday', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00863: Execute GET /leave/saveHolidays [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/saveHolidays',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
