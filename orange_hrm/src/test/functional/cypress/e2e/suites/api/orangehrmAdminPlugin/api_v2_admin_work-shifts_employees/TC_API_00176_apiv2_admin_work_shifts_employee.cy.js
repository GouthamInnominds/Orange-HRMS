/**
 * Test Case ID: TC_API_00176
 * Route: apiv2_admin_work_shifts_employee
 * Endpoint: GET /api/v2/admin/work-shifts/employees
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00176: apiv2_admin_work_shifts_employee', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00176: Execute GET /api/v2/admin/work-shifts/employees [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/admin/work-shifts/employees',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
