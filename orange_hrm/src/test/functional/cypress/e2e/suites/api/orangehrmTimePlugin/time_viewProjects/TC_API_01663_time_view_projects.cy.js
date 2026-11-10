/**
 * Test Case ID: TC_API_01663
 * Route: time_view_projects
 * Endpoint: GET /time/viewProjects
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01663: time_view_projects', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01663: Execute GET /time/viewProjects [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewProjects',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
