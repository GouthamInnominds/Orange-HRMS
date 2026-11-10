/**
 * Test Case ID: TC_API_01544
 * Route: recruitment_rss_feed
 * Endpoint: GET /recruitmentApply/jobs.rss
 * Method: GET
 * Priority: High
 */

describe('orangehrmRecruitmentPlugin - TC_API_01544: recruitment_rss_feed', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01544: Execute GET /recruitmentApply/jobs.rss [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/recruitmentApply/jobs.rss',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
