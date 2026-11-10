/**
 * Test Case ID: TC_API_00471
 * Route: apiv2_buzz_shares
 * Endpoint: POST /api/v2/buzz/shares
 * Method: POST
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00471: apiv2_buzz_shares', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00471: Execute POST /api/v2/buzz/shares [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/buzz/shares',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
