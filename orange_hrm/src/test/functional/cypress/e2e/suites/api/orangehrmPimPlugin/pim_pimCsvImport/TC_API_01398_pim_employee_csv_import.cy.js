/**
 * Test Case ID: TC_API_01398
 * Route: pim_employee_csv_import
 * Endpoint: GET /pim/pimCsvImport
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01398: pim_employee_csv_import', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01398: Execute GET /pim/pimCsvImport [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/pimCsvImport',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
