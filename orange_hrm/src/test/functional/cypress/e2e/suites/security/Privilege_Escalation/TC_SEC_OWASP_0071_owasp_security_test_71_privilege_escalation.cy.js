/**
 * Test Case ID: TC_SEC_OWASP_0071
 * OWASP Category: Privilege_Escalation
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0071: Privilege_Escalation', function () {
  it('TC_SEC_OWASP_0071: OWASP Security Test 71 - Privilege_Escalation', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
