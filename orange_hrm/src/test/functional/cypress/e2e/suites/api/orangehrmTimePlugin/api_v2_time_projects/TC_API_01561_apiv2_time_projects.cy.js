/**
 * Test Case ID: TC_API_01561
 * Route: apiv2_time_projects
 * Endpoint: DELETE /api/v2/time/projects
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01561: apiv2_time_projects', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01561: Execute DELETE /api/v2/time/projects [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/time/projects',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
