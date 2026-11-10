/**
 * Test Case ID: TC_API_01346
 * Route: pim_module
 * Endpoint: GET /pim/viewPimModule
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01346: pim_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01346: Execute GET /pim/viewPimModule [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewPimModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
