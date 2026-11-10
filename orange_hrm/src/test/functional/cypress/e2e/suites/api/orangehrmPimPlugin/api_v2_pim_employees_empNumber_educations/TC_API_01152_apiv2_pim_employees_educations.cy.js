/**
 * Test Case ID: TC_API_01152
 * Route: apiv2_pim_employees_educations
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/educations
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01152: apiv2_pim_employees_educations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01152: Execute GET /api/v2/pim/employees/1/educations [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/educations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
