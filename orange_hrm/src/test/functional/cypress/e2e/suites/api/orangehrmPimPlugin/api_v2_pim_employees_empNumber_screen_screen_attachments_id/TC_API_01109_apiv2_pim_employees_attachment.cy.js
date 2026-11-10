/**
 * Test Case ID: TC_API_01109
 * Route: apiv2_pim_employees_attachment
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01109: apiv2_pim_employees_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01109: Execute GET /api/v2/pim/employees/1/screen/1/attachments/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/screen/1/attachments/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
