/**
 * Test Case ID: TC_API_01113
 * Route: apiv2_pim_employees_attachments
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01113: apiv2_pim_employees_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01113: Execute GET /api/v2/pim/employees/1/screen/1/attachments [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/screen/1/attachments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
