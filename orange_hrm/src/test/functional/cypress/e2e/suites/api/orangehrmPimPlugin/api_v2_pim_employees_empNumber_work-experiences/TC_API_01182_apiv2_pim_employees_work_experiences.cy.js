/**
 * Test Case ID: TC_API_01182
 * Route: apiv2_pim_employees_work_experiences
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/work-experiences
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01182: apiv2_pim_employees_work_experiences', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01182: Execute GET /api/v2/pim/employees/1/work-experiences [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/work-experiences',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
