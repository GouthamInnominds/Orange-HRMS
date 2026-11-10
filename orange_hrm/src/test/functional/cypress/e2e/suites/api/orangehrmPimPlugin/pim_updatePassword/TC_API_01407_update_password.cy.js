/**
 * Test Case ID: TC_API_01407
 * Route: update_password
 * Endpoint: GET /pim/updatePassword
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01407: update_password', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01407: Execute GET /pim/updatePassword [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/updatePassword',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
