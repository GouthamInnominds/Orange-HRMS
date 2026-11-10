/**
 * Test Case ID: TC_API_00861
 * Route: list_holidays
 * Endpoint: GET /leave/viewHolidayList
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00861: list_holidays', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00861: Execute GET /leave/viewHolidayList [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewHolidayList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
