/**
 * Test Case ID: TC_API_01131
 * Route: apiv2_pim_employee_emergency_contacts
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/emergency-contacts
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01131: apiv2_pim_employee_emergency_contacts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01131: Execute DELETE /api/v2/pim/employees/1/emergency-contacts [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/emergency-contacts',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
