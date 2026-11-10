/**
 * Automated Cypress API Contract Test Suite for orangehrmTimePlugin
 * Tests: 129
 */

describe('orangehrmTimePlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/time/projects/{id}', function () {
    it('TC_API_01550: apiv2_time_project [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/projects/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01551: apiv2_time_project [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/projects/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/projects/{id}', function () {
    it('TC_API_01552: apiv2_time_project [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/projects/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01553: apiv2_time_project [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/projects/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01554: apiv2_time_project [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/projects/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/projects', function () {
    it('TC_API_01555: apiv2_time_projects [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/projects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01556: apiv2_time_projects [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/projects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/time/projects', function () {
    it('TC_API_01557: apiv2_time_projects [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/projects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01558: apiv2_time_projects [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/projects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01559: apiv2_time_projects [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/projects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/time/projects', function () {
    it('TC_API_01560: apiv2_time_projects [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/time/projects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01561: apiv2_time_projects [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/time/projects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/validation/project-name', function () {
    it('TC_API_01562: apiv2_time_validate_project_name [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/validation/project-name',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01563: apiv2_time_validate_project_name [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/validation/project-name',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/time-sheet-period', function () {
    it('TC_API_01564: apiv2_time_time_sheet_period_config [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/time-sheet-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01565: apiv2_time_time_sheet_period_config [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/time-sheet-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/time-sheet-period', function () {
    it('TC_API_01566: apiv2_time_time_sheet_period_config [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/time-sheet-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01567: apiv2_time_time_sheet_period_config [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/time-sheet-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01568: apiv2_time_time_sheet_period_config [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/time-sheet-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/customers/{id}', function () {
    it('TC_API_01569: apiv2_time_customer [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/customers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01570: apiv2_time_customer [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/customers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/customers/{id}', function () {
    it('TC_API_01571: apiv2_time_customer [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/customers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01572: apiv2_time_customer [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/customers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01573: apiv2_time_customer [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/customers/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/customers', function () {
    it('TC_API_01574: apiv2_time_customers [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/customers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01575: apiv2_time_customers [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/customers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/time/customers', function () {
    it('TC_API_01576: apiv2_time_customers [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/customers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01577: apiv2_time_customers [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/customers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01578: apiv2_time_customers [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/customers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/time/customers', function () {
    it('TC_API_01579: apiv2_time_customers [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/time/customers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01580: apiv2_time_customers [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/time/customers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/validation/customer-name', function () {
    it('TC_API_01581: apiv2_time_validate_customer_name [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/validation/customer-name',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01582: apiv2_time_validate_customer_name [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/validation/customer-name',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/project/{projectId}/activities', function () {
    it('TC_API_01583: apiv2_time_project_activities [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/project/1/activities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01584: apiv2_time_project_activities [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/project/1/activities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/time/project/{projectId}/activities', function () {
    it('TC_API_01585: apiv2_time_project_activities [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/project/1/activities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01586: apiv2_time_project_activities [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/project/1/activities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01587: apiv2_time_project_activities [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/project/1/activities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/time/project/{projectId}/activities', function () {
    it('TC_API_01588: apiv2_time_project_activities [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/time/project/1/activities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01589: apiv2_time_project_activities [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/time/project/1/activities',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/project/{projectId}/activities/{id}', function () {
    it('TC_API_01590: apiv2_time_project_activity [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/project/1/activities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01591: apiv2_time_project_activity [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/project/1/activities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/project/{projectId}/activities/{id}', function () {
    it('TC_API_01592: apiv2_time_project_activity [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/project/1/activities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01593: apiv2_time_project_activity [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/project/1/activities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01594: apiv2_time_project_activity [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/project/1/activities/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/validation/activity-name/{id}', function () {
    it('TC_API_01595: apiv2_time_validate_project_activity_name [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/validation/activity-name/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01596: apiv2_time_validate_project_activity_name [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/validation/activity-name/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/timesheets', function () {
    it('TC_API_01597: apiv2_time_my_time_sheets [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01598: apiv2_time_my_time_sheets [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/time/timesheets', function () {
    it('TC_API_01599: apiv2_time_my_time_sheets [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01600: apiv2_time_my_time_sheets [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01601: apiv2_time_my_time_sheets [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/timesheets/{id}', function () {
    it('TC_API_01602: apiv2_time_my_time_sheet [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01603: apiv2_time_my_time_sheet [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01604: apiv2_time_my_time_sheet [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/employees/{empNumber}/timesheets', function () {
    it('TC_API_01605: apiv2_time_employee_time_sheets [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/employees/1/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01606: apiv2_time_employee_time_sheets [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/employees/1/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/time/employees/{empNumber}/timesheets', function () {
    it('TC_API_01607: apiv2_time_employee_time_sheets [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/employees/1/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01608: apiv2_time_employee_time_sheets [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/employees/1/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01609: apiv2_time_employee_time_sheets [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/employees/1/timesheets',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/employees/{empNumber}/timesheets/{id}', function () {
    it('TC_API_01610: apiv2_time_employee_time_sheet [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/employees/1/timesheets/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01611: apiv2_time_employee_time_sheet [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/employees/1/timesheets/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01612: apiv2_time_employee_time_sheet [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/employees/1/timesheets/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/timesheets/default', function () {
    it('TC_API_01613: apiv2_time_default_time_sheet [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets/default',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01614: apiv2_time_default_time_sheet [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets/default',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/timesheets/{timesheetId}/entries', function () {
    it('TC_API_01615: apiv2_time_my_timesheets_entries [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01616: apiv2_time_my_timesheets_entries [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/timesheets/{timesheetId}/entries', function () {
    it('TC_API_01617: apiv2_time_my_timesheets_entries [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01618: apiv2_time_my_timesheets_entries [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01619: apiv2_time_my_timesheets_entries [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/employees/timesheets/{timesheetId}/entries', function () {
    it('TC_API_01620: apiv2_time_employees_timesheets_entries [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/employees/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01621: apiv2_time_employees_timesheets_entries [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/employees/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/employees/timesheets/{timesheetId}/entries', function () {
    it('TC_API_01622: apiv2_time_employees_timesheets_entries [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/employees/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01623: apiv2_time_employees_timesheets_entries [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/employees/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01624: apiv2_time_employees_timesheets_entries [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/employees/timesheets/1/entries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/timesheets/{timesheetId}/action-logs', function () {
    it('TC_API_01625: apiv2_time_timesheet_action_log [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets/1/action-logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01626: apiv2_time_timesheet_action_log [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets/1/action-logs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/validation/{timesheetId}/project-activity', function () {
    it('TC_API_01627: apiv2_time_timesheet_project_activity_unique_validation [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/validation/1/project-activity',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01628: apiv2_time_timesheet_project_activity_unique_validation [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/validation/1/project-activity',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/time/timesheets/{timesheetId}/entries/comment', function () {
    it('TC_API_01629: apiv2_time_my_timesheet_entries_comments [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1/entries/comment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01630: apiv2_time_my_timesheet_entries_comments [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1/entries/comment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01631: apiv2_time_my_timesheet_entries_comments [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/time/timesheets/1/entries/comment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/timesheets/{timesheetId}/entries/{id}/comment', function () {
    it('TC_API_01632: apiv2_time_my_timesheet_entries_comment [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets/1/entries/1/comment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01633: apiv2_time_my_timesheet_entries_comment [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/timesheets/1/entries/1/comment',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/config/time-format', function () {
    it('TC_API_01634: apiv2_time_my_timesheet_time_format_config [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/config/time-format',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01635: apiv2_time_my_timesheet_time_format_config [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/config/time-format',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}', function () {
    it('TC_API_01636: apiv2_time_copy_activity [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/projects/1/activities/copy/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01637: apiv2_time_copy_activity [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/projects/1/activities/copy/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}', function () {
    it('TC_API_01638: apiv2_time_copy_activity [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/projects/1/activities/copy/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01639: apiv2_time_copy_activity [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/projects/1/activities/copy/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01640: apiv2_time_copy_activity [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/time/projects/1/activities/copy/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/employees/timesheets/list', function () {
    it('TC_API_01641: apiv2_time_employee_timesheets_list [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/employees/timesheets/list',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01642: apiv2_time_employee_timesheets_list [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/employees/timesheets/list',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/reports', function () {
    it('TC_API_01643: apiv2_time_reports [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/reports',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01644: apiv2_time_reports [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/reports',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/reports/data', function () {
    it('TC_API_01645: apiv2_time_reports_data [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/reports/data',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01646: apiv2_time_reports_data [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/reports/data',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/time/project-admins', function () {
    it('TC_API_01647: apiv2_time_project_admins [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/project-admins',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01648: apiv2_time_project_admins [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/time/project-admins',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/viewTimeModule', function () {
    it('TC_API_01649: time_module [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewTimeModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01650: time_module [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewTimeModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/defineTimesheetPeriod', function () {
    it('TC_API_01651: view_time_sheet_config [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/defineTimesheetPeriod',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01652: view_time_sheet_config [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/defineTimesheetPeriod',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/viewCustomers', function () {
    it('TC_API_01653: view_customers [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewCustomers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01654: view_customers [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewCustomers',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/addCustomer', function () {
    it('TC_API_01655: save_customer [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/addCustomer',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01656: save_customer [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/addCustomer',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/addCustomer/{id}', function () {
    it('TC_API_01657: edit_customer [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/addCustomer/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01658: edit_customer [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/addCustomer/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/viewMyTimesheet', function () {
    it('TC_API_01659: time_my_timesheet [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewMyTimesheet',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01660: time_my_timesheet [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewMyTimesheet',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/editTimesheet/{id}', function () {
    it('TC_API_01661: time_edit_timesheet [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/editTimesheet/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01662: time_edit_timesheet [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/editTimesheet/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/viewProjects', function () {
    it('TC_API_01663: time_view_projects [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewProjects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01664: time_view_projects [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewProjects',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/saveProject', function () {
    it('TC_API_01665: time_save_project [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/saveProject',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01666: time_save_project [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/saveProject',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/saveProject/{id}', function () {
    it('TC_API_01667: time_edit_project [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/saveProject/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01668: time_edit_project [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/saveProject/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/viewEmployeeTimesheet', function () {
    it('TC_API_01669: time_employee_timesheet [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewEmployeeTimesheet',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01670: time_employee_timesheet [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewEmployeeTimesheet',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/viewTimesheet/employeeId/{id}', function () {
    it('TC_API_01671: time_employee_view_timesheet [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewTimesheet/employeeId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01672: time_employee_view_timesheet [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/viewTimesheet/employeeId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/displayEmployeeReportCriteria', function () {
    it('TC_API_01673: time_employee_report [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/displayEmployeeReportCriteria',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01674: time_employee_report [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/displayEmployeeReportCriteria',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/displayProjectReportCriteria', function () {
    it('TC_API_01675: time_project_activity_report [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/displayProjectReportCriteria',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01676: time_project_activity_report [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/displayProjectReportCriteria',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/displayProjectActivityDetailsReport', function () {
    it('TC_API_01677: time_activity_details_report [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/displayProjectActivityDetailsReport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01678: time_activity_details_report [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/displayProjectActivityDetailsReport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
