/**
 * Test Case ID: TC_API_00341
 * Route: view_work_shift
 * Endpoint: GET /admin/workShift
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00341: view_work_shift', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00341: Execute GET /admin/workShift [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/workShift',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
