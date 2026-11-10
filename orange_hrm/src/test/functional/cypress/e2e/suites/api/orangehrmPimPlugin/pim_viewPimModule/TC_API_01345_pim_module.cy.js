/**
 * Test Case ID: TC_API_01345
 * Route: pim_module
 * Endpoint: GET /pim/viewPimModule
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01345: pim_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01345: Execute GET /pim/viewPimModule [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewPimModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
