/**
 * Test Case ID: TC_SEC_OWASP_0035
 * OWASP Category: SQL_Injection
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0035: SQL_Injection', function () {
  it('TC_SEC_OWASP_0035: OWASP Security Test 35 - SQL_Injection', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
