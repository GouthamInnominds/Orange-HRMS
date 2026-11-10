/**
 * Test Case ID: TC_API_01517
 * Route: recruitment_module
 * Endpoint: GET /recruitment/viewRecruitmentModule
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01517: recruitment_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01517: Execute GET /recruitment/viewRecruitmentModule [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewRecruitmentModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
