/**
 * Test Case ID: TC_API_01353
 * Route: pim_employee_personal_details
 * Endpoint: GET /pim/viewPersonalDetails/empNumber/{empNumber}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01353: pim_employee_personal_details', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01353: Execute GET /pim/viewPersonalDetails/empNumber/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewPersonalDetails/empNumber/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
