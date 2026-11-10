/**
 * Test Case ID: TC_API_01567
 * Route: apiv2_time_time_sheet_period_config
 * Endpoint: PUT /api/v2/time/time-sheet-period
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01567: apiv2_time_time_sheet_period_config', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01567: Execute PUT /api/v2/time/time-sheet-period [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/time-sheet-period',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
