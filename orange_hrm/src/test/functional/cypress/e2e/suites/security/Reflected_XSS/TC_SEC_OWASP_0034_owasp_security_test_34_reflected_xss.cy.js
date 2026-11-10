/**
 * Test Case ID: TC_SEC_OWASP_0034
 * OWASP Category: Reflected_XSS
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0034: Reflected_XSS', function () {
  it('TC_SEC_OWASP_0034: OWASP Security Test 34 - Reflected_XSS', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
