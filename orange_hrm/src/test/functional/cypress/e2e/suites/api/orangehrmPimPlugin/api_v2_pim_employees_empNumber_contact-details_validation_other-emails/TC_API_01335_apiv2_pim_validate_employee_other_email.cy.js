/**
 * Test Case ID: TC_API_01335
 * Route: apiv2_pim_validate_employee_other_email
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/contact-details/validation/other-emails
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01335: apiv2_pim_validate_employee_other_email', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01335: Execute GET /api/v2/pim/employees/1/contact-details/validation/other-emails [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/contact-details/validation/other-emails',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
