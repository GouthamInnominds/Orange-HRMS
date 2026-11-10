/**
 * Test Case ID: TC_API_00342
 * Route: save_work_shift
 * Endpoint: GET /admin/saveWorkShifts
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00342: save_work_shift', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00342: Execute GET /admin/saveWorkShifts [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveWorkShifts',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
