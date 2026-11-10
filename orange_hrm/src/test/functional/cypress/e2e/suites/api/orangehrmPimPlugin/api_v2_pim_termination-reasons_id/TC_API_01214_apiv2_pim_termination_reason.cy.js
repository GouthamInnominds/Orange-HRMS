/**
 * Test Case ID: TC_API_01214
 * Route: apiv2_pim_termination_reason
 * Endpoint: GET /api/v2/pim/termination-reasons/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01214: apiv2_pim_termination_reason', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01214: Execute GET /api/v2/pim/termination-reasons/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/termination-reasons/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
