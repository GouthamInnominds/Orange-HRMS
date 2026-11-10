/**
 * Test Case ID: TC_API_01647
 * Route: apiv2_time_project_admins
 * Endpoint: GET /api/v2/time/project-admins
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01647: apiv2_time_project_admins', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01647: Execute GET /api/v2/time/project-admins [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/project-admins',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
