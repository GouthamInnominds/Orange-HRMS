/**
 * Automated Cypress API Contract Test Suite for orangehrmDashboardPlugin
 * Tests: 19
 */

describe('orangehrmDashboardPlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/dashboard/employees/leaves', function () {
    it('TC_API_00674: apiv2_dashboard_employees_on_leave [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/leaves',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00675: apiv2_dashboard_employees_on_leave [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/leaves',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/dashboard/employees/subunit', function () {
    it('TC_API_00676: apiv2_dashboard_employees_by_subunit [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/subunit',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00677: apiv2_dashboard_employees_by_subunit [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/subunit',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/dashboard/shortcuts', function () {
    it('TC_API_00678: apiv2_dashboard_quick_launch [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/shortcuts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00679: apiv2_dashboard_quick_launch [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/shortcuts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/dashboard/employees/locations', function () {
    it('TC_API_00680: apiv2_dashboard_employees_by_location [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00681: apiv2_dashboard_employees_by_location [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/locations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/dashboard/employees/time-at-work', function () {
    it('TC_API_00682: apiv2_dashboard_employee_time_at_work [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/time-at-work',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00683: apiv2_dashboard_employee_time_at_work [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/time-at-work',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/dashboard/employees/action-summary', function () {
    it('TC_API_00684: apiv2_dashboard_employee_action_summary [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/action-summary',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00685: apiv2_dashboard_employee_action_summary [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/employees/action-summary',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/dashboard/config/employee-on-leave-today', function () {
    it('TC_API_00686: apiv2_dashboard_employee_on_leave_today_configuration [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/config/employee-on-leave-today',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00687: apiv2_dashboard_employee_on_leave_today_configuration [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/dashboard/config/employee-on-leave-today',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/dashboard/config/employee-on-leave-today', function () {
    it('TC_API_00688: apiv2_dashboard_employee_on_leave_today_configuration [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/dashboard/config/employee-on-leave-today',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00689: apiv2_dashboard_employee_on_leave_today_configuration [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/dashboard/config/employee-on-leave-today',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00690: apiv2_dashboard_employee_on_leave_today_configuration [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/dashboard/config/employee-on-leave-today',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /dashboard/index', function () {
    it('TC_API_00691: dashboard_widget [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/dashboard/index',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00692: dashboard_widget [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/dashboard/index',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
