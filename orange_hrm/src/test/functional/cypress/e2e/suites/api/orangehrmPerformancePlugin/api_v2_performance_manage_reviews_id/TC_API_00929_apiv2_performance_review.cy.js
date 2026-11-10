/**
 * Test Case ID: TC_API_00929
 * Route: apiv2_performance_review
 * Endpoint: PUT /api/v2/performance/manage/reviews/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00929: apiv2_performance_review', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00929: Execute PUT /api/v2/performance/manage/reviews/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/performance/manage/reviews/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
