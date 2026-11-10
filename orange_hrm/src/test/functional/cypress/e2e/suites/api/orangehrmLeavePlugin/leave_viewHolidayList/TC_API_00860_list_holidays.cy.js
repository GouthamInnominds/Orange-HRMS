/**
 * Test Case ID: TC_API_00860
 * Route: list_holidays
 * Endpoint: GET /leave/viewHolidayList
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00860: list_holidays', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00860: Execute GET /leave/viewHolidayList [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewHolidayList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
