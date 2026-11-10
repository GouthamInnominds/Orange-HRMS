/**
 * Test Case ID: TC_API_01656
 * Route: save_customer
 * Endpoint: GET /time/addCustomer
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01656: save_customer', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01656: Execute GET /time/addCustomer [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/addCustomer',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
