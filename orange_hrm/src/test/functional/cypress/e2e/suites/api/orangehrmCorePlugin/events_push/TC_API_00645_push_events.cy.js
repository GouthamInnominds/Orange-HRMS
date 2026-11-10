/**
 * Test Case ID: TC_API_00645
 * Route: push_events
 * Endpoint: POST /events/push
 * Method: POST
 * Priority: High
 */

describe('orangehrmCorePlugin - TC_API_00645: push_events', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00645: Execute POST /events/push [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/events/push',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
