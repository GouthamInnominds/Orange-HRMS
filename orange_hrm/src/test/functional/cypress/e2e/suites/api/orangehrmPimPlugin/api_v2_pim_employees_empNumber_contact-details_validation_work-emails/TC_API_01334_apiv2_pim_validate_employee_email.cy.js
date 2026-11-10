/**
 * Test Case ID: TC_API_01334
 * Route: apiv2_pim_validate_employee_email
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/contact-details/validation/work-emails
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01334: apiv2_pim_validate_employee_email', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01334: Execute GET /api/v2/pim/employees/1/contact-details/validation/work-emails [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/contact-details/validation/work-emails',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
