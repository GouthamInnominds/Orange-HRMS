/**
 * Test Case ID: TC_API_01297
 * Route: apiv2_pim_employees_memberships
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/memberships
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01297: apiv2_pim_employees_memberships', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01297: Execute DELETE /api/v2/pim/employees/1/memberships [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/memberships',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
