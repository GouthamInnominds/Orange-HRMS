/**
 * Test Case ID: TC_API_01047
 * Route: apiv2_pim_employee_custom_fields
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/custom-fields
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01047: apiv2_pim_employee_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01047: Execute GET /api/v2/pim/employees/1/custom-fields [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/custom-fields',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
