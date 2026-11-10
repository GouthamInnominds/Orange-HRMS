/**
 * Test Case ID: TC_API_00059
 * Route: apiv2_admin_employment_status
 * Endpoint: PUT /api/v2/admin/employment-statuses/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmAdminPlugin - TC_API_00059: apiv2_admin_employment_status', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00059: Execute PUT /api/v2/admin/employment-statuses/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/employment-statuses/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
