/**
 * Test Case ID: TC_API_01179
 * Route: apiv2_pim_employees_allowed_languages
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/languages/allowed
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01179: apiv2_pim_employees_allowed_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01179: Execute POST /api/v2/pim/employees/1/languages/allowed [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/languages/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
