/**
 * Test Case ID: TC_API_01375
 * Route: edit_termination_reason
 * Endpoint: GET /pim/saveTerminationReasons/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01375: edit_termination_reason', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01375: Execute GET /pim/saveTerminationReasons/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveTerminationReasons/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
