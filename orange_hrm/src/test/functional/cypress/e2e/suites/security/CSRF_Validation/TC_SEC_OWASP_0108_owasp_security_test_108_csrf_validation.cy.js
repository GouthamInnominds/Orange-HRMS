/**
 * Test Case ID: TC_SEC_OWASP_0108
 * OWASP Category: CSRF_Validation
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0108: CSRF_Validation', function () {
  it('TC_SEC_OWASP_0108: OWASP Security Test 108 - CSRF_Validation', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
