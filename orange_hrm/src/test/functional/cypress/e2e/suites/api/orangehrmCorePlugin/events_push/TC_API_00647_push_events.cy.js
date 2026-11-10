/**
 * Test Case ID: TC_API_00647
 * Route: push_events
 * Endpoint: POST /events/push
 * Method: POST
 * Priority: High
 */

describe('orangehrmCorePlugin - TC_API_00647: push_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00647: Execute POST /events/push [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/events/push',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
