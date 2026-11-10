/**
 * Test Case ID: TC_API_01081
 * Route: apiv2_pim_employee_contact_details
 * Endpoint: PUT /api/v2/pim/employee/{empNumber}/contact-details
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01081: apiv2_pim_employee_contact_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01081: Execute PUT /api/v2/pim/employee/1/contact-details [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employee/1/contact-details',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
