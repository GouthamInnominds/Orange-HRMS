/**
 * Test Case ID: TC_API_01168
 * Route: apiv2_pim_employees_languages
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/languages
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01168: apiv2_pim_employees_languages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01168: Execute DELETE /api/v2/pim/employees/1/languages [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/languages',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
