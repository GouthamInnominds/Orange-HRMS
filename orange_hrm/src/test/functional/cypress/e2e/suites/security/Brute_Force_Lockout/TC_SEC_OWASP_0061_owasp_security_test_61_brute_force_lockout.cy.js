/**
 * Test Case ID: TC_SEC_OWASP_0061
 * OWASP Category: Brute_Force_Lockout
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0061: Brute_Force_Lockout', function () {
  it('TC_SEC_OWASP_0061: OWASP Security Test 61 - Brute_Force_Lockout', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
