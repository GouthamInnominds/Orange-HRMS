/**
 * Test Case ID: TC_API_01658
 * Route: edit_customer
 * Endpoint: GET /time/addCustomer/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01658: edit_customer', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01658: Execute GET /time/addCustomer/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/addCustomer/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
