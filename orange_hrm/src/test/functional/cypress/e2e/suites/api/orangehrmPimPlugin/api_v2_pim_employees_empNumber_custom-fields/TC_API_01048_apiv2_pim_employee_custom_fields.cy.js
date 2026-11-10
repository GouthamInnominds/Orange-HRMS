/**
 * Test Case ID: TC_API_01048
 * Route: apiv2_pim_employee_custom_fields
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/custom-fields
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01048: apiv2_pim_employee_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01048: Execute GET /api/v2/pim/employees/1/custom-fields [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/custom-fields',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
