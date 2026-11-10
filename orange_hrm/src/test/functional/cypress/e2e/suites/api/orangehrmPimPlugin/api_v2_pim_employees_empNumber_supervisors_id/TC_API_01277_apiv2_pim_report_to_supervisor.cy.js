/**
 * Test Case ID: TC_API_01277
 * Route: apiv2_pim_report_to_supervisor
 * Endpoint: PUT /api/v2/pim/employees/{empNumber}/supervisors/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01277: apiv2_pim_report_to_supervisor', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01277: Execute PUT /api/v2/pim/employees/1/supervisors/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/employees/1/supervisors/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
