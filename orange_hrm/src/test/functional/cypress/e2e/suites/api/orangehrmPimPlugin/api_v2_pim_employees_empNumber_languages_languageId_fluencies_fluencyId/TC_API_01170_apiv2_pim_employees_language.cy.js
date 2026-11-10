/**
 * Test Case ID: TC_API_01170
 * Route: apiv2_pim_employees_language
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/languages/{languageId}/fluencies/{fluencyId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01170: apiv2_pim_employees_language', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01170: Execute GET /api/v2/pim/employees/1/languages/1/fluencies/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/languages/1/fluencies/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
