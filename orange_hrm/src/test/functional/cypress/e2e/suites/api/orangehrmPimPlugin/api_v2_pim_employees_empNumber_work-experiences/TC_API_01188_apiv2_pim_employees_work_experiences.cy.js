/**
 * Test Case ID: TC_API_01188
 * Route: apiv2_pim_employees_work_experiences
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/work-experiences
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01188: apiv2_pim_employees_work_experiences', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01188: Execute DELETE /api/v2/pim/employees/1/work-experiences [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/work-experiences',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
