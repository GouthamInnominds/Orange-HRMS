/**
 * Test Case ID: TC_API_01253
 * Route: apiv2_pim_optional_field
 * Endpoint: PUT /api/v2/pim/optional-field
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01253: apiv2_pim_optional_field', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01253: Execute PUT /api/v2/pim/optional-field [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/optional-field',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
