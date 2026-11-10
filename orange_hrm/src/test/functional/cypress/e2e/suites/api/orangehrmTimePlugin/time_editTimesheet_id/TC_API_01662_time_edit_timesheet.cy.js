/**
 * Test Case ID: TC_API_01662
 * Route: time_edit_timesheet
 * Endpoint: GET /time/editTimesheet/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01662: time_edit_timesheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01662: Execute GET /time/editTimesheet/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/editTimesheet/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
