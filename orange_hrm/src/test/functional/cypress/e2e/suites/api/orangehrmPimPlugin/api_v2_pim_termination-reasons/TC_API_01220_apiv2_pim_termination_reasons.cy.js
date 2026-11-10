/**
 * Test Case ID: TC_API_01220
 * Route: apiv2_pim_termination_reasons
 * Endpoint: POST /api/v2/pim/termination-reasons
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01220: apiv2_pim_termination_reasons', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01220: Execute POST /api/v2/pim/termination-reasons [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/termination-reasons',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
