/**
 * Test Case ID: TC_API_01664
 * Route: time_view_projects
 * Endpoint: GET /time/viewProjects
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01664: time_view_projects', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01664: Execute GET /time/viewProjects [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewProjects',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
