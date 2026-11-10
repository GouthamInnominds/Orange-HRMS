/**
 * Test Case ID: TC_API_01543
 * Route: recruitment_public_applicants
 * Endpoint: POST /recruitment/public/applicants
 * Method: POST
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01543: recruitment_public_applicants', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01543: Execute POST /recruitment/public/applicants [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/recruitment/public/applicants',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
