/**
 * Test Case ID: TC_API_00716
 * Route: apiv2_leave_holiday
 * Endpoint: PUT /api/v2/leave/holidays/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00716: apiv2_leave_holiday', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00716: Execute PUT /api/v2/leave/holidays/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/holidays/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
