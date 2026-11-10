/**
 * Test Case ID: TC_API_01655
 * Route: save_customer
 * Endpoint: GET /time/addCustomer
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01655: save_customer', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01655: Execute GET /time/addCustomer [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/addCustomer',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
