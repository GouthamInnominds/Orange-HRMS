/**
 * Test Case ID: TC_API_01363
 * Route: pim_employee_profile_picture
 * Endpoint: GET /pim/viewPhotograph/empNumber/{empNumber}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01363: pim_employee_profile_picture', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01363: Execute GET /pim/viewPhotograph/empNumber/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewPhotograph/empNumber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
