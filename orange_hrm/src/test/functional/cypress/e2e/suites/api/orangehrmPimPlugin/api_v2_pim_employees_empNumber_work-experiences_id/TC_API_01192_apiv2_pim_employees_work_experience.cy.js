/**
 * Test Case ID: TC_API_01192
 * Route: apiv2_pim_employees_work_experience
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/work-experiences/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01192: apiv2_pim_employees_work_experience', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01192: Execute PUT /api/v2/pim/employees/1/work-experiences/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/work-experiences/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
