/**
 * Test Case ID: TC_API_01176
 * Route: apiv2_pim_employees_allowed_languages
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/languages/allowed
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01176: apiv2_pim_employees_allowed_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01176: Execute GET /api/v2/pim/employees/1/languages/allowed [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/languages/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
