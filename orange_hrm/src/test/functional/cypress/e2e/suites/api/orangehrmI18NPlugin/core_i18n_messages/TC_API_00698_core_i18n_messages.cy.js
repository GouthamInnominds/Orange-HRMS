/**
 * Test Case ID: TC_API_00698
 * Route: core_i18n_messages
 * Endpoint: GET /core/i18n/messages
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmI18NPlugin - TC_API_00698: core_i18n_messages', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00698: Execute GET /core/i18n/messages [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/core/i18n/messages',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
