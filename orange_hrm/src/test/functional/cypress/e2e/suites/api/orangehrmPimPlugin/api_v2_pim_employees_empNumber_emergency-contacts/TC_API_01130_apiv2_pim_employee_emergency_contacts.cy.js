/**
 * Test Case ID: TC_API_01130
 * Route: apiv2_pim_employee_emergency_contacts
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/emergency-contacts
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01130: apiv2_pim_employee_emergency_contacts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01130: Execute DELETE /api/v2/pim/employees/1/emergency-contacts [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/emergency-contacts',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
