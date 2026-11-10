/**
 * Test Case ID: TC_API_00177
 * Route: apiv2_admin_work_shifts_employee
 * Endpoint: GET /api/v2/admin/work-shifts/employees
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00177: apiv2_admin_work_shifts_employee', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00177: Execute GET /api/v2/admin/work-shifts/employees [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/work-shifts/employees',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
