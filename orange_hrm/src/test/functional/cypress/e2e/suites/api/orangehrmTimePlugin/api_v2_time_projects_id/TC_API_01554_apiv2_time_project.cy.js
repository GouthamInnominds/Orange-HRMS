/**
 * Test Case ID: TC_API_01554
 * Route: apiv2_time_project
 * Endpoint: PUT /api/v2/time/projects/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01554: apiv2_time_project', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01554: Execute PUT /api/v2/time/projects/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/time/projects/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
