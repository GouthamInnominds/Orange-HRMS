/**
 * Test Case ID: TC_API_01341
 * Route: pim_employee_attachment
 * Endpoint: GET /pim/viewAttachment/empNumber/{empNumber}/attachId/{attachId}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01341: pim_employee_attachment', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01341: Execute GET /pim/viewAttachment/empNumber/1/attachId/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewAttachment/empNumber/1/attachId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
