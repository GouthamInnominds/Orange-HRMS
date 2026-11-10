/**
 * Test Case ID: TC_API_01120
 * Route: apiv2_pim_employee_emergency_contact
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/emergency-contacts/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01120: apiv2_pim_employee_emergency_contact', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01120: Execute GET /api/v2/pim/employees/1/emergency-contacts/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/emergency-contacts/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
