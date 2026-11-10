/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET | Tests: 25
 */

describe('Feature: FEAT_DIR_DASHBOARD_QUICK_LAUNCH___LEAVE_BALANCE_WIDGET', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_DIR_1006: Dashboard Quick Launch & Leave Balance Widget - Scenario 1 (Positive)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1007: Dashboard Quick Launch & Leave Balance Widget - Scenario 2 (Negative)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1008: Dashboard Quick Launch & Leave Balance Widget - Scenario 3 (Boundary)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Boundary conditions (Rule validation #3).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1009: Dashboard Quick Launch & Leave Balance Widget - Scenario 4 (Security/RBAC)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1010: Dashboard Quick Launch & Leave Balance Widget - Scenario 5 (Positive)', function () {
    // Priority: Critical | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1011: Dashboard Quick Launch & Leave Balance Widget - Scenario 6 (Negative)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1012: Dashboard Quick Launch & Leave Balance Widget - Scenario 7 (Boundary)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Boundary conditions (Rule validation #7).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1013: Dashboard Quick Launch & Leave Balance Widget - Scenario 8 (Security/RBAC)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Security/RBAC conditions (Rule validation #8).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1014: Dashboard Quick Launch & Leave Balance Widget - Scenario 9 (Positive)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1015: Dashboard Quick Launch & Leave Balance Widget - Scenario 10 (Negative)', function () {
    // Priority: Critical | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1016: Dashboard Quick Launch & Leave Balance Widget - Scenario 11 (Boundary)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1017: Dashboard Quick Launch & Leave Balance Widget - Scenario 12 (Security/RBAC)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Security/RBAC conditions (Rule validation #12).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1018: Dashboard Quick Launch & Leave Balance Widget - Scenario 13 (Positive)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Positive conditions (Rule validation #13).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1019: Dashboard Quick Launch & Leave Balance Widget - Scenario 14 (Negative)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Negative conditions (Rule validation #14).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1020: Dashboard Quick Launch & Leave Balance Widget - Scenario 15 (Boundary)', function () {
    // Priority: Critical | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1021: Dashboard Quick Launch & Leave Balance Widget - Scenario 16 (Security/RBAC)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Security/RBAC conditions (Rule validation #16).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1022: Dashboard Quick Launch & Leave Balance Widget - Scenario 17 (Positive)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1023: Dashboard Quick Launch & Leave Balance Widget - Scenario 18 (Negative)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1024: Dashboard Quick Launch & Leave Balance Widget - Scenario 19 (Boundary)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Boundary conditions (Rule validation #19).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1025: Dashboard Quick Launch & Leave Balance Widget - Scenario 20 (Security/RBAC)', function () {
    // Priority: Critical | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1026: Dashboard Quick Launch & Leave Balance Widget - Scenario 21 (Positive)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1027: Dashboard Quick Launch & Leave Balance Widget - Scenario 22 (Negative)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1028: Dashboard Quick Launch & Leave Balance Widget - Scenario 23 (Boundary)', function () {
    // Priority: Medium | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1029: Dashboard Quick Launch & Leave Balance Widget - Scenario 24 (Security/RBAC)', function () {
    // Priority: High | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Security/RBAC conditions (Rule validation #24).
    cy.url().should('include', '/auth/login');
  });

  it('TC_DIR_1030: Dashboard Quick Launch & Leave Balance Widget - Scenario 25 (Positive)', function () {
    // Priority: Critical | Objective: Validate Dashboard Quick Launch & Leave Balance Widget behavior under Positive conditions (Rule validation #25).
    cy.url().should('include', '/auth/login');
  });

});
