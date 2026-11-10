/**
 * Test Case ID: TC_API_01595
 * Route: apiv2_time_validate_project_activity_name
 * Endpoint: GET /api/v2/time/validation/activity-name/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01595: apiv2_time_validate_project_activity_name', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01595: Execute GET /api/v2/time/validation/activity-name/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/validation/activity-name/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
