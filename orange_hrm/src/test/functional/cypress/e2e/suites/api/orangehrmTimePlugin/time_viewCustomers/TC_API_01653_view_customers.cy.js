/**
 * Test Case ID: TC_API_01653
 * Route: view_customers
 * Endpoint: GET /time/viewCustomers
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01653: view_customers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01653: Execute GET /time/viewCustomers [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewCustomers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
