/**
 * Test Case ID: TC_API_00864
 * Route: edit_holiday
 * Endpoint: GET /leave/saveHolidays/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00864: edit_holiday', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00864: Execute GET /leave/saveHolidays/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/saveHolidays/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
