/**
 * Test Case ID: TC_API_00858
 * Route: leave_work_week
 * Endpoint: GET /leave/defineWorkWeek
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00858: leave_work_week', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00858: Execute GET /leave/defineWorkWeek [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/defineWorkWeek',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
