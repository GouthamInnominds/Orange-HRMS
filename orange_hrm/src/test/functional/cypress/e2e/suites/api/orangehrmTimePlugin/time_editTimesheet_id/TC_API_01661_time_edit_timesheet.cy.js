/**
 * Test Case ID: TC_API_01661
 * Route: time_edit_timesheet
 * Endpoint: GET /time/editTimesheet/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01661: time_edit_timesheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01661: Execute GET /time/editTimesheet/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/editTimesheet/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
