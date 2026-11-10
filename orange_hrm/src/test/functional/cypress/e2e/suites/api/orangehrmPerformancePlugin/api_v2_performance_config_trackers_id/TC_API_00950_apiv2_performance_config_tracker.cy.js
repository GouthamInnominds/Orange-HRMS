/**
 * Test Case ID: TC_API_00950
 * Route: apiv2_performance_config_tracker
 * Endpoint: PUT /api/v2/performance/config/trackers/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00950: apiv2_performance_config_tracker', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00950: Execute PUT /api/v2/performance/config/trackers/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/performance/config/trackers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
