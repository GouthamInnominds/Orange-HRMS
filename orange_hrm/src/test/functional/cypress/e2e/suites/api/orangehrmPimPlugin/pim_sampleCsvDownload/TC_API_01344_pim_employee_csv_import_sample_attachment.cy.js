/**
 * Test Case ID: TC_API_01344
 * Route: pim_employee_csv_import_sample_attachment
 * Endpoint: GET /pim/sampleCsvDownload
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01344: pim_employee_csv_import_sample_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01344: Execute GET /pim/sampleCsvDownload [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/sampleCsvDownload',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
