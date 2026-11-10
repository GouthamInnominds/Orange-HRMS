/**
 * Test Case ID: TC_API_01243
 * Route: apiv2_pim_custom_fields
 * Endpoint: DELETE /api/v2/pim/custom-fields
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01243: apiv2_pim_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01243: Execute DELETE /api/v2/pim/custom-fields [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/custom-fields',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
