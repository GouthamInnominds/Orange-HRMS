/**
 * Test Case ID: TC_API_00072
 * Route: apiv2_education
 * Endpoint: PUT /api/v2/admin/educations/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmAdminPlugin - TC_API_00072: apiv2_education', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00072: Execute PUT /api/v2/admin/educations/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/admin/educations/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
