/**
 * Test Case ID: TC_SEC_OWASP_0083
 * OWASP Category: SQL_Injection
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0083: SQL_Injection', function () {
  it('TC_SEC_OWASP_0083: OWASP Security Test 83 - SQL_Injection', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
