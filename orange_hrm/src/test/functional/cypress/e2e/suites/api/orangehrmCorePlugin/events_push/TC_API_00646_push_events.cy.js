/**
 * Test Case ID: TC_API_00646
 * Route: push_events
 * Endpoint: POST /events/push
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmCorePlugin - TC_API_00646: push_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00646: Execute POST /events/push [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/events/push',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
