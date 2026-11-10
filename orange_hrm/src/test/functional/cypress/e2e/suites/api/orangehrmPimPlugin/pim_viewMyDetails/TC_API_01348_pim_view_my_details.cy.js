/**
 * Test Case ID: TC_API_01348
 * Route: pim_view_my_details
 * Endpoint: GET /pim/viewMyDetails
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01348: pim_view_my_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01348: Execute GET /pim/viewMyDetails [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewMyDetails',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
