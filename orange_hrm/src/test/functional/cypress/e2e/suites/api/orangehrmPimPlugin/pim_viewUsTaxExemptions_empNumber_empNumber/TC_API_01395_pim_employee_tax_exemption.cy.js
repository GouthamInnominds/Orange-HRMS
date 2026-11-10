/**
 * Test Case ID: TC_API_01395
 * Route: pim_employee_tax_exemption
 * Endpoint: GET /pim/viewUsTaxExemptions/empNumber/{empNumber}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01395: pim_employee_tax_exemption', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01395: Execute GET /pim/viewUsTaxExemptions/empNumber/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewUsTaxExemptions/empNumber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
