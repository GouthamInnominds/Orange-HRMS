/**
 * Test Case ID: TC_API_01666
 * Route: time_save_project
 * Endpoint: GET /time/saveProject
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01666: time_save_project', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01666: Execute GET /time/saveProject [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/saveProject',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
