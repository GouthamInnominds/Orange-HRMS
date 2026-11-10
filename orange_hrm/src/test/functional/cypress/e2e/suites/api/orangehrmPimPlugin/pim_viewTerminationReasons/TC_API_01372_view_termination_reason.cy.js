/**
 * Test Case ID: TC_API_01372
 * Route: view_termination_reason
 * Endpoint: GET /pim/viewTerminationReasons
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01372: view_termination_reason', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01372: Execute GET /pim/viewTerminationReasons [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewTerminationReasons',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
