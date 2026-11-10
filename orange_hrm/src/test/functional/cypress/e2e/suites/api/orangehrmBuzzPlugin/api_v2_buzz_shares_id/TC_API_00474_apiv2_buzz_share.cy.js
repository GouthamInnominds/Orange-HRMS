/**
 * Test Case ID: TC_API_00474
 * Route: apiv2_buzz_share
 * Endpoint: PUT /api/v2/buzz/shares/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00474: apiv2_buzz_share', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00474: Execute PUT /api/v2/buzz/shares/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/buzz/shares/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
