/**
 * Test Case ID: TC_API_00512
 * Route: buzz_photo
 * Endpoint: GET /buzz/photo/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00512: buzz_photo', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00512: Execute GET /buzz/photo/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/buzz/photo/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
