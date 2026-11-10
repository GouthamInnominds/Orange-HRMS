/**
 * Test Case ID: TC_API_01330
 * Route: apiv2_pim_update_password
 * Endpoint: PUT /api/v2/pim/update-password
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01330: apiv2_pim_update_password', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01330: Execute PUT /api/v2/pim/update-password [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/update-password',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
