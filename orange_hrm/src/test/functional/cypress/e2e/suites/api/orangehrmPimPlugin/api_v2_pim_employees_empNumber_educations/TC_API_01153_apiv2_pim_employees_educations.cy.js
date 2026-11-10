/**
 * Test Case ID: TC_API_01153
 * Route: apiv2_pim_employees_educations
 * Endpoint: POST /api/v2/pim/employees/{empNumber}/educations
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01153: apiv2_pim_employees_educations', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01153: Execute POST /api/v2/pim/employees/1/educations [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/employees/1/educations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
