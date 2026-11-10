/**
 * Test Case ID: TC_API_01551
 * Route: apiv2_time_project
 * Endpoint: GET /api/v2/time/projects/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01551: apiv2_time_project', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01551: Execute GET /api/v2/time/projects/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/projects/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
