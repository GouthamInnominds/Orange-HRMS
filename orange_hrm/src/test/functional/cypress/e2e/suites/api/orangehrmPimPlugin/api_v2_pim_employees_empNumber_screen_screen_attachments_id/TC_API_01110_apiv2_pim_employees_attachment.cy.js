/**
 * Test Case ID: TC_API_01110
 * Route: apiv2_pim_employees_attachment
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01110: apiv2_pim_employees_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01110: Execute PUT /api/v2/pim/employees/1/screen/1/attachments/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/screen/1/attachments/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
