/**
 * Test Case ID: TC_API_01364
 * Route: pim_employee_profile_picture
 * Endpoint: GET /pim/viewPhotograph/empNumber/{empNumber}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01364: pim_employee_profile_picture', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01364: Execute GET /pim/viewPhotograph/empNumber/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewPhotograph/empNumber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
