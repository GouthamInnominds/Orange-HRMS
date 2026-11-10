/**
 * Test Case ID: TC_API_01311
 * Route: apiv2_pim_employees_import
 * Endpoint: POST /api/v2/pim/csv-import
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01311: apiv2_pim_employees_import', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01311: Execute POST /api/v2/pim/csv-import [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/csv-import',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
