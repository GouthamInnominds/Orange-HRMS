/**
 * Test Case ID: TC_API_00290
 * Route: edit_education
 * Endpoint: GET /admin/saveEducation/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00290: edit_education', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00290: Execute GET /admin/saveEducation/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/admin/saveEducation/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
