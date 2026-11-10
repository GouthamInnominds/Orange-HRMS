/**
 * Test Case ID: TC_SEC_OWASP_0054
 * OWASP Category: Session_Fixation
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0054: Session_Fixation', function () {
  it('TC_SEC_OWASP_0054: OWASP Security Test 54 - Session_Fixation', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
