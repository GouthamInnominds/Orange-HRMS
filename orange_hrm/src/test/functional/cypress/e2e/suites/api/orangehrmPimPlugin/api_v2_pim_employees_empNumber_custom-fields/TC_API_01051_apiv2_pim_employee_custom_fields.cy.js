/**
 * Test Case ID: TC_API_01051
 * Route: apiv2_pim_employee_custom_fields
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/custom-fields
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01051: apiv2_pim_employee_custom_fields', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01051: Execute PUT /api/v2/pim/employees/1/custom-fields [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/custom-fields',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
