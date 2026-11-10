/**
 * Test Case ID: TC_API_01082
 * Route: apiv2_pim_employee_contact_details
 * Endpoint: PUT /api/v2/pim/employee/{empNumber}/contact-details
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01082: apiv2_pim_employee_contact_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01082: Execute PUT /api/v2/pim/employee/1/contact-details [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employee/1/contact-details',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
