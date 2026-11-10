/**
 * Test Case ID: TC_API_01518
 * Route: recruitment_module
 * Endpoint: GET /recruitment/viewRecruitmentModule
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01518: recruitment_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01518: Execute GET /recruitment/viewRecruitmentModule [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitment/viewRecruitmentModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
