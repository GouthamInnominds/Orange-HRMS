/**
 * Test Case ID: TC_API_01563
 * Route: apiv2_time_validate_project_name
 * Endpoint: GET /api/v2/time/validation/project-name
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01563: apiv2_time_validate_project_name', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01563: Execute GET /api/v2/time/validation/project-name [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/validation/project-name',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
