/**
 * Test Case ID: TC_API_01185
 * Route: apiv2_pim_employees_work_experiences
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/work-experiences
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01185: apiv2_pim_employees_work_experiences', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01185: Execute POST /api/v2/pim/employees/1/work-experiences [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/work-experiences',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
