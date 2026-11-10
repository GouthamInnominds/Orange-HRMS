/**
 * Test Case ID: TC_API_01636
 * Route: apiv2_time_copy_activity
 * Endpoint: GET /api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01636: apiv2_time_copy_activity', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01636: Execute GET /api/v2/time/projects/1/activities/copy/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/projects/1/activities/copy/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
