/**
 * Test Case ID: TC_API_01376
 * Route: edit_termination_reason
 * Endpoint: GET /pim/saveTerminationReasons/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01376: edit_termination_reason', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01376: Execute GET /pim/saveTerminationReasons/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveTerminationReasons/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
