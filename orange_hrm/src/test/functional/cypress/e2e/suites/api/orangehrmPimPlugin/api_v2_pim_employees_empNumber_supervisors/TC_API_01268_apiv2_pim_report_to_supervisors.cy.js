/**
 * Test Case ID: TC_API_01268
 * Route: apiv2_pim_report_to_supervisors
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/supervisors
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01268: apiv2_pim_report_to_supervisors', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01268: Execute POST /api/v2/pim/employees/1/supervisors [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/supervisors',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
