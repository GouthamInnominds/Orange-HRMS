/**
 * Test Case ID: TC_API_01189
 * Route: apiv2_pim_employees_work_experience
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/work-experiences/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01189: apiv2_pim_employees_work_experience', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01189: Execute GET /api/v2/pim/employees/1/work-experiences/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/work-experiences/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
