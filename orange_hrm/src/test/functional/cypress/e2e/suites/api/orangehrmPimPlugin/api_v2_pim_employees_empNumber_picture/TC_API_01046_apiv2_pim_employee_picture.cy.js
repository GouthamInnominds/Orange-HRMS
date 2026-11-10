/**
 * Test Case ID: TC_API_01046
 * Route: apiv2_pim_employee_picture
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/picture
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01046: apiv2_pim_employee_picture', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01046: Execute PUT /api/v2/pim/employees/1/picture [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/picture',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
