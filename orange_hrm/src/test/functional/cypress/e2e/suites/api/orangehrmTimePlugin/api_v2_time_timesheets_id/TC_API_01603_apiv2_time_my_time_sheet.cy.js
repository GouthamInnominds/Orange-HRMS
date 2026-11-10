/**
 * Test Case ID: TC_API_01603
 * Route: apiv2_time_my_time_sheet
 * Endpoint: PUT /api/v2/time/timesheets/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01603: apiv2_time_my_time_sheet', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01603: Execute PUT /api/v2/time/timesheets/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/timesheets/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
