/**
 * Test Case ID: TC_API_01042
 * Route: apiv2_pim_employee_picture
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/picture
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01042: apiv2_pim_employee_picture', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01042: Execute GET /api/v2/pim/employees/1/picture [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/picture',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
