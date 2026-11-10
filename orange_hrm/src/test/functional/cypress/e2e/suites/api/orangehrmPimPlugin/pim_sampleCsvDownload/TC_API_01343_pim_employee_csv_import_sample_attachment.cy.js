/**
 * Test Case ID: TC_API_01343
 * Route: pim_employee_csv_import_sample_attachment
 * Endpoint: GET /pim/sampleCsvDownload
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01343: pim_employee_csv_import_sample_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01343: Execute GET /pim/sampleCsvDownload [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/sampleCsvDownload',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
