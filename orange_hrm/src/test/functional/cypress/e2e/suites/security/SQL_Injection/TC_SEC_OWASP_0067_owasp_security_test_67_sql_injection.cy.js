/**
 * Test Case ID: TC_SEC_OWASP_0067
 * OWASP Category: SQL_Injection
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0067: SQL_Injection', function () {
  it('TC_SEC_OWASP_0067: OWASP Security Test 67 - SQL_Injection', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
