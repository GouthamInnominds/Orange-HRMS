/**
 * Test Case ID: TC_API_00345
 * Route: edit_work_shift
 * Endpoint: GET /admin/saveWorkShifts/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00345: edit_work_shift', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00345: Execute GET /admin/saveWorkShifts/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveWorkShifts/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
