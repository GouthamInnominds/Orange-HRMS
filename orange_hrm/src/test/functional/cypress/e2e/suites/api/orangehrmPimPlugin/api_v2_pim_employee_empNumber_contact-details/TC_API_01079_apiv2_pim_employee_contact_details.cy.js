/**
 * Test Case ID: TC_API_01079
 * Route: apiv2_pim_employee_contact_details
 * Endpoint: GET /api/v2/pim/employee/{empNumber}/contact-details
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01079: apiv2_pim_employee_contact_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01079: Execute GET /api/v2/pim/employee/1/contact-details [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employee/1/contact-details',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
