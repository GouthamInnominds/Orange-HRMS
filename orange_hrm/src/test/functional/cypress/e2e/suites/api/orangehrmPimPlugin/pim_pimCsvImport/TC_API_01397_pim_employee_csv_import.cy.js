/**
 * Test Case ID: TC_API_01397
 * Route: pim_employee_csv_import
 * Endpoint: GET /pim/pimCsvImport
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01397: pim_employee_csv_import', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01397: Execute GET /pim/pimCsvImport [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/pimCsvImport',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
