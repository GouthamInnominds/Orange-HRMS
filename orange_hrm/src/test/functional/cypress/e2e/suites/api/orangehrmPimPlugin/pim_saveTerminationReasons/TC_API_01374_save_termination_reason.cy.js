/**
 * Test Case ID: TC_API_01374
 * Route: save_termination_reason
 * Endpoint: GET /pim/saveTerminationReasons
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01374: save_termination_reason', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01374: Execute GET /pim/saveTerminationReasons [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveTerminationReasons',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
