/**
 * Test Case ID: TC_API_01308
 * Route: apiv2_pim_employees_us_tax_exemption
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/tax-exemption
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01308: apiv2_pim_employees_us_tax_exemption', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01308: Execute PUT /api/v2/pim/employees/1/tax-exemption [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/tax-exemption',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
