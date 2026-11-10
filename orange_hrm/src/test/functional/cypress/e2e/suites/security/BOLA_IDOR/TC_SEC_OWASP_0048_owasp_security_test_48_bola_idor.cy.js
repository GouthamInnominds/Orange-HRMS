/**
 * Test Case ID: TC_SEC_OWASP_0048
 * OWASP Category: BOLA_IDOR
 * Priority: Critical
 */

describe('Security - TC_SEC_OWASP_0048: BOLA_IDOR', function () {
  it('TC_SEC_OWASP_0048: OWASP Security Test 48 - BOLA_IDOR', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/salary-components',
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.be.oneOf([401, 403, 302]);
    });
  });
});
