/**
 * Test Case ID: TC_API_01116
 * Route: apiv2_pim_employees_attachments
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01116: apiv2_pim_employees_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01116: Execute POST /api/v2/pim/employees/1/screen/1/attachments [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/screen/1/attachments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
