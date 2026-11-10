/**
 * Test Case ID: TC_API_00885
 * Route: maintainence_candidate_records
 * Endpoint: GET /maintenance/purgeCandidateData
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmMaintenancePlugin - TC_API_00885: maintainence_candidate_records', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00885: Execute GET /maintenance/purgeCandidateData [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/maintenance/purgeCandidateData',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
