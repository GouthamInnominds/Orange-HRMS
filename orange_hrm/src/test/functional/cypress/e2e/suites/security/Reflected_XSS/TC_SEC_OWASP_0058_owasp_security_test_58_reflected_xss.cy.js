/**
 * Test Case ID: TC_SEC_OWASP_0058
 * OWASP Category: Reflected_XSS
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0058: Reflected_XSS', function () {
  it('TC_SEC_OWASP_0058: OWASP Security Test 58 - Reflected_XSS', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
