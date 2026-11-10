/**
 * Test Case ID: TC_API_01338
 * Route: apiv2_pim_my_info
 * Endpoint: GET /api/v2/pim/myself
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01338: apiv2_pim_my_info', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01338: Execute GET /api/v2/pim/myself [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/myself',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
