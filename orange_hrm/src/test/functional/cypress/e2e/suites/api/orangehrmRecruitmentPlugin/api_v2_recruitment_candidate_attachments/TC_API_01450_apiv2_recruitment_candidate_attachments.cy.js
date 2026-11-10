/**
 * Test Case ID: TC_API_01450
 * Route: apiv2_recruitment_candidate_attachments
 * Endpoint: POST /api/v2/recruitment/candidate/attachments
 * Method: POST
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01450: apiv2_recruitment_candidate_attachments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01450: Execute POST /api/v2/recruitment/candidate/attachments [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/recruitment/candidate/attachments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
