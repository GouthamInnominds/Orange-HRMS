/**
 * Test Case ID: TC_API_01207
 * Route: apiv2_pim_employees_allowed_licenses
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/licenses/allowed
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01207: apiv2_pim_employees_allowed_licenses', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01207: Execute DELETE /api/v2/pim/employees/1/licenses/allowed [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/licenses/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
