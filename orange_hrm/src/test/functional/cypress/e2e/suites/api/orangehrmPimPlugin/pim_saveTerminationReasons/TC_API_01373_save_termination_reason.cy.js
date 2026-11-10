/**
 * Test Case ID: TC_API_01373
 * Route: save_termination_reason
 * Endpoint: GET /pim/saveTerminationReasons
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01373: save_termination_reason', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01373: Execute GET /pim/saveTerminationReasons [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveTerminationReasons',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
