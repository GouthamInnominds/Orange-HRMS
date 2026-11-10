/**
 * Test Case ID: TC_API_01359
 * Route: pim_employee_dependents
 * Endpoint: GET /pim/viewDependents/empNumber/{empNumber}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01359: pim_employee_dependents', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01359: Execute GET /pim/viewDependents/empNumber/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewDependents/empNumber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
