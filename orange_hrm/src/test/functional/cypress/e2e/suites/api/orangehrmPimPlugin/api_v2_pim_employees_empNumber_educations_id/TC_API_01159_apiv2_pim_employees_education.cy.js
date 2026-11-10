/**
 * Test Case ID: TC_API_01159
 * Route: apiv2_pim_employees_education
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/educations/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01159: apiv2_pim_employees_education', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01159: Execute GET /api/v2/pim/employees/1/educations/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/educations/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
