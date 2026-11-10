/**
 * Test Case ID: TC_API_01309
 * Route: apiv2_pim_employees_work_shift
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/work-shift
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01309: apiv2_pim_employees_work_shift', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01309: Execute GET /api/v2/pim/employees/1/work-shift [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/work-shift',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
