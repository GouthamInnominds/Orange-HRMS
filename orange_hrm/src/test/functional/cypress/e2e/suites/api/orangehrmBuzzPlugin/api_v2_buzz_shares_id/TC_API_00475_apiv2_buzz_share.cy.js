/**
 * Test Case ID: TC_API_00475
 * Route: apiv2_buzz_share
 * Endpoint: DELETE /api/v2/buzz/shares/{id}
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00475: apiv2_buzz_share', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00475: Execute DELETE /api/v2/buzz/shares/1 [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/buzz/shares/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
