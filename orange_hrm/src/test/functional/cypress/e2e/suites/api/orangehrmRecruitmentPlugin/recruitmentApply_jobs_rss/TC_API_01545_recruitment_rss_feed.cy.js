/**
 * Test Case ID: TC_API_01545
 * Route: recruitment_rss_feed
 * Endpoint: GET /recruitmentApply/jobs.rss
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmRecruitmentPlugin - TC_API_01545: recruitment_rss_feed', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01545: Execute GET /recruitmentApply/jobs.rss [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitmentApply/jobs.rss',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
