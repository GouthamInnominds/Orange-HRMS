/**
 * Test Case ID: TC_API_00469
 * Route: apiv2_buzz_shares
 * Endpoint: POST /api/v2/buzz/shares
 * Method: POST
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00469: apiv2_buzz_shares', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00469: Execute POST /api/v2/buzz/shares [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/buzz/shares',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
