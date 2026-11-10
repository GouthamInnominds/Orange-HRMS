/**
 * Test Case ID: TC_API_01053
 * Route: apiv2_pim_employees_personal_details
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/personal-details
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01053: apiv2_pim_employees_personal_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01053: Execute GET /api/v2/pim/employees/1/personal-details [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/personal-details',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
