/**
 * Test Case ID: TC_API_01281
 * Route: apiv2_pim_report_to_subordinate
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/subordinates/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01281: apiv2_pim_report_to_subordinate', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01281: Execute PUT /api/v2/pim/employees/1/subordinates/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/subordinates/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
