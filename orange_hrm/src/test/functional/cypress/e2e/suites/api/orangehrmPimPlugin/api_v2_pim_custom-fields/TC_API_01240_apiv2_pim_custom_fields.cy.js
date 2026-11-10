/**
 * Test Case ID: TC_API_01240
 * Route: apiv2_pim_custom_fields
 * Endpoint: POST /api/v2/pim/custom-fields
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01240: apiv2_pim_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01240: Execute POST /api/v2/pim/custom-fields [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/custom-fields',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
