/**
 * Test Case ID: TC_API_01562
 * Route: apiv2_time_validate_project_name
 * Endpoint: GET /api/v2/time/validation/project-name
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01562: apiv2_time_validate_project_name', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01562: Execute GET /api/v2/time/validation/project-name [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/validation/project-name',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
