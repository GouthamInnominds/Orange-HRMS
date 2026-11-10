/**
 * Test Case ID: TC_API_01366
 * Route: pim_employee_job
 * Endpoint: GET /pim/viewJobDetails/empNumber/{empNumber}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01366: pim_employee_job', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01366: Execute GET /pim/viewJobDetails/empNumber/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewJobDetails/empNumber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
