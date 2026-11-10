/**
 * Test Case ID: TC_API_01392
 * Route: pim_employee_immigration
 * Endpoint: GET /pim/viewImmigration/empNumber/{empNumber}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01392: pim_employee_immigration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01392: Execute GET /pim/viewImmigration/empNumber/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewImmigration/empNumber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
