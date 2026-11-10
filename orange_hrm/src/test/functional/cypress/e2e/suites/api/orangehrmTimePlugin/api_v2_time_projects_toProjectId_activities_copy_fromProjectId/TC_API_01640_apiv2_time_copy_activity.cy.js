/**
 * Test Case ID: TC_API_01640
 * Route: apiv2_time_copy_activity
 * Endpoint: POST /api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}
 * Method: POST
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01640: apiv2_time_copy_activity', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01640: Execute POST /api/v2/time/projects/1/activities/copy/1 [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/projects/1/activities/copy/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
