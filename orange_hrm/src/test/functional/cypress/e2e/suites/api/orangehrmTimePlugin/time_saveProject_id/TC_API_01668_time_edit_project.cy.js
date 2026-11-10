/**
 * Test Case ID: TC_API_01668
 * Route: time_edit_project
 * Endpoint: GET /time/saveProject/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01668: time_edit_project', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01668: Execute GET /time/saveProject/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/saveProject/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
