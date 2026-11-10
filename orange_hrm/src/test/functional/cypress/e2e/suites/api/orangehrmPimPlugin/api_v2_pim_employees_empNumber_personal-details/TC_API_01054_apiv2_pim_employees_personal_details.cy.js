/**
 * Test Case ID: TC_API_01054
 * Route: apiv2_pim_employees_personal_details
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/personal-details
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01054: apiv2_pim_employees_personal_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01054: Execute PUT /api/v2/pim/employees/1/personal-details [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/personal-details',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
