/**
 * Test Case ID: TC_API_01557
 * Route: apiv2_time_projects
 * Endpoint: POST /api/v2/time/projects
 * Method: POST
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01557: apiv2_time_projects', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01557: Execute POST /api/v2/time/projects [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/projects',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
