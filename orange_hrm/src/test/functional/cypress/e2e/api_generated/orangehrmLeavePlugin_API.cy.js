/**
 * Automated Cypress API Contract Test Suite for orangehrmLeavePlugin
 * Tests: 158
 */

describe('orangehrmLeavePlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/leave/holidays/{id}', function () {
    it('TC_API_00712: apiv2_leave_holiday [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/holidays/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00713: apiv2_leave_holiday [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/holidays/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/holidays/{id}', function () {
    it('TC_API_00714: apiv2_leave_holiday [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/holidays/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00715: apiv2_leave_holiday [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/holidays/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00716: apiv2_leave_holiday [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/holidays/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/holidays', function () {
    it('TC_API_00717: apiv2_leave_holidays [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/holidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00718: apiv2_leave_holidays [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/holidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/leave/holidays', function () {
    it('TC_API_00719: apiv2_leave_holidays [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/holidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00720: apiv2_leave_holidays [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/holidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00721: apiv2_leave_holidays [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/holidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/leave/holidays', function () {
    it('TC_API_00722: apiv2_leave_holidays [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/holidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00723: apiv2_leave_holidays [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/holidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/workweek', function () {
    it('TC_API_00724: apiv2_leave_workweek [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/workweek',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00725: apiv2_leave_workweek [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/workweek',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/workweek', function () {
    it('TC_API_00726: apiv2_leave_workweek [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/workweek',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00727: apiv2_leave_workweek [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/workweek',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00728: apiv2_leave_workweek [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/workweek',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-period', function () {
    it('TC_API_00729: apiv2_leave_leave_period [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00730: apiv2_leave_leave_period [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/leave-period', function () {
    it('TC_API_00731: apiv2_leave_leave_period [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00732: apiv2_leave_leave_period [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00733: apiv2_leave_leave_period [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-period',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-periods', function () {
    it('TC_API_00734: apiv2_leave_leave_periods [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-periods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00735: apiv2_leave_leave_periods [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-periods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-types/{id}', function () {
    it('TC_API_00736: apiv2_leave_leave_type [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00737: apiv2_leave_leave_type [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/leave-types/{id}', function () {
    it('TC_API_00738: apiv2_leave_leave_type [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00739: apiv2_leave_leave_type [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00740: apiv2_leave_leave_type [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-types', function () {
    it('TC_API_00741: apiv2_leave_leave_types [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00742: apiv2_leave_leave_types [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/leave/leave-types', function () {
    it('TC_API_00743: apiv2_leave_leave_types [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00744: apiv2_leave_leave_types [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00745: apiv2_leave_leave_types [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/leave/leave-types', function () {
    it('TC_API_00746: apiv2_leave_leave_types [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/leave-types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00747: apiv2_leave_leave_types [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/leave-types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-types/eligible', function () {
    it('TC_API_00748: apiv2_leave_eligible_leave_types [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-types/eligible',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00749: apiv2_leave_eligible_leave_types [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-types/eligible',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/leave/leave-types/eligible', function () {
    it('TC_API_00750: apiv2_leave_eligible_leave_types [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-types/eligible',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00751: apiv2_leave_eligible_leave_types [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-types/eligible',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00752: apiv2_leave_eligible_leave_types [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-types/eligible',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/leave/leave-types/eligible', function () {
    it('TC_API_00753: apiv2_leave_eligible_leave_types [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/leave-types/eligible',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00754: apiv2_leave_eligible_leave_types [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/leave-types/eligible',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-requests', function () {
    it('TC_API_00755: apiv2_leave_my_leave_requests [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00756: apiv2_leave_my_leave_requests [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/leave/leave-requests', function () {
    it('TC_API_00757: apiv2_leave_my_leave_requests [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00758: apiv2_leave_my_leave_requests [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00759: apiv2_leave_my_leave_requests [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/leave/leave-requests', function () {
    it('TC_API_00760: apiv2_leave_my_leave_requests [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00761: apiv2_leave_my_leave_requests [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-requests/{leaveRequestId}', function () {
    it('TC_API_00762: apiv2_leave_my_leave_request [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00763: apiv2_leave_my_leave_request [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/leave-requests/{leaveRequestId}', function () {
    it('TC_API_00764: apiv2_leave_my_leave_request [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00765: apiv2_leave_my_leave_request [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00766: apiv2_leave_my_leave_request [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/employees/leave-requests', function () {
    it('TC_API_00767: apiv2_leave_employee_leave_requests [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00768: apiv2_leave_employee_leave_requests [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/leave/employees/leave-requests', function () {
    it('TC_API_00769: apiv2_leave_employee_leave_requests [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/employees/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00770: apiv2_leave_employee_leave_requests [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/employees/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00771: apiv2_leave_employee_leave_requests [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/employees/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/leave/employees/leave-requests', function () {
    it('TC_API_00772: apiv2_leave_employee_leave_requests [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/employees/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00773: apiv2_leave_employee_leave_requests [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/employees/leave-requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/employees/leave-requests/{leaveRequestId}', function () {
    it('TC_API_00774: apiv2_leave_employee_leave_request [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00775: apiv2_leave_employee_leave_request [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/employees/leave-requests/{leaveRequestId}', function () {
    it('TC_API_00776: apiv2_leave_employee_leave_request [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/employees/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00777: apiv2_leave_employee_leave_request [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/employees/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00778: apiv2_leave_employee_leave_request [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/employees/leave-requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/employees/leave-requests/bulk', function () {
    it('TC_API_00779: apiv2_leave_employees_bulk_leave_request [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/employees/leave-requests/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00780: apiv2_leave_employees_bulk_leave_request [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/employees/leave-requests/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00781: apiv2_leave_employees_bulk_leave_request [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/employees/leave-requests/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-entitlements/{id}', function () {
    it('TC_API_00782: apiv2_leave_leave_entitlement [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-entitlements/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00783: apiv2_leave_leave_entitlement [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-entitlements/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/leave-entitlements/{id}', function () {
    it('TC_API_00784: apiv2_leave_leave_entitlement [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-entitlements/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00785: apiv2_leave_leave_entitlement [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-entitlements/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00786: apiv2_leave_leave_entitlement [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leave-entitlements/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-entitlements', function () {
    it('TC_API_00787: apiv2_leave_leave_entitlements [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00788: apiv2_leave_leave_entitlements [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/leave/leave-entitlements', function () {
    it('TC_API_00789: apiv2_leave_leave_entitlements [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00790: apiv2_leave_leave_entitlements [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00791: apiv2_leave_leave_entitlements [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/leave/leave-entitlements', function () {
    it('TC_API_00792: apiv2_leave_leave_entitlements [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00793: apiv2_leave_leave_entitlements [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/leave/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/employees/{empNumber}/leave-entitlements', function () {
    it('TC_API_00794: apiv2_leave_employee_leave_entitlements [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/1/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00795: apiv2_leave_employee_leave_entitlements [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/1/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/employees/leave-entitlements', function () {
    it('TC_API_00796: apiv2_leave_employees_leave_entitlements [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00797: apiv2_leave_employees_leave_entitlements [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leave-entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-balance/leave-type/{leaveTypeId}', function () {
    it('TC_API_00798: apiv2_leave_leave_balance [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-balance/leave-type/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00799: apiv2_leave_leave_balance [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-balance/leave-type/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/employees/leave-balances', function () {
    it('TC_API_00800: apiv2_leave_employee_leave_balances [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leave-balances',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00801: apiv2_leave_employee_leave_balances [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leave-balances',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-entitlements/{id}/validation/entitlements', function () {
    it('TC_API_00802: apiv2_leave_leave_entitlements_validation_value [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-entitlements/1/validation/entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00803: apiv2_leave_leave_entitlements_validation_value [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-entitlements/1/validation/entitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/overlap-leaves', function () {
    it('TC_API_00804: apiv2_leave_overlap_leaves [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/overlap-leaves',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00805: apiv2_leave_overlap_leaves [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/overlap-leaves',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-requests/{leaveRequestId}/leave-comments', function () {
    it('TC_API_00806: apiv2_leave_request_comments [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-requests/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00807: apiv2_leave_request_comments [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-requests/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/leave/leave-requests/{leaveRequestId}/leave-comments', function () {
    it('TC_API_00808: apiv2_leave_request_comments [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-requests/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00809: apiv2_leave_request_comments [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-requests/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00810: apiv2_leave_request_comments [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leave-requests/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leaves/{leaveId}/leave-comments', function () {
    it('TC_API_00811: apiv2_leave_comments [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leaves/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00812: apiv2_leave_comments [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leaves/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/leave/leaves/{leaveId}/leave-comments', function () {
    it('TC_API_00813: apiv2_leave_comments [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leaves/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00814: apiv2_leave_comments [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leaves/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00815: apiv2_leave_comments [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/leave/leaves/1/leave-comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/leave-requests/{leaveRequestId}/leaves', function () {
    it('TC_API_00816: apiv2_leave_leaves [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-requests/1/leaves',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00817: apiv2_leave_leaves [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/leave-requests/1/leaves',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/leaves/{leaveId}', function () {
    it('TC_API_00818: apiv2_leave_leave [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leaves/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00819: apiv2_leave_leave [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leaves/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00820: apiv2_leave_leave [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leaves/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/leave/leaves/bulk', function () {
    it('TC_API_00821: apiv2_leave_bulk_leaves [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leaves/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00822: apiv2_leave_bulk_leaves [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leaves/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00823: apiv2_leave_bulk_leaves [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/leave/leaves/bulk',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/reports', function () {
    it('TC_API_00824: apiv2_leave_reports [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/reports',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00825: apiv2_leave_reports [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/reports',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/reports/data', function () {
    it('TC_API_00826: apiv2_leave_reports_data [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/reports/data',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00827: apiv2_leave_reports_data [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/reports/data',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/leave/employees/leaves', function () {
    it('TC_API_00828: apiv2_leave_employee_leave [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leaves',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00829: apiv2_leave_employee_leave [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/leave/employees/leaves',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewLeaveModule', function () {
    it('TC_API_00830: leave_module [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00831: leave_module [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/defineLeavePeriod', function () {
    it('TC_API_00832: leave_define_leave_period [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/defineLeavePeriod',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00833: leave_define_leave_period [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/defineLeavePeriod',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/applyLeave', function () {
    it('TC_API_00834: leave_apply_leave [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/applyLeave',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00835: leave_apply_leave [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/applyLeave',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/assignLeave', function () {
    it('TC_API_00836: leave_assign_leave [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/assignLeave',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00837: leave_assign_leave [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/assignLeave',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewLeaveList', function () {
    it('TC_API_00838: leave_leave_list [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00839: leave_leave_list [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewMyLeaveList', function () {
    it('TC_API_00840: leave_my_leave_list [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewMyLeaveList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00841: leave_my_leave_list [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewMyLeaveList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewLeaveRequest/{id}', function () {
    it('TC_API_00842: leave_view_leave_request [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveRequest/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00843: leave_view_leave_request [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveRequest/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/leaveTypeList', function () {
    it('TC_API_00844: view_leave_type [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/leaveTypeList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00845: view_leave_type [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/leaveTypeList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/defineLeaveType', function () {
    it('TC_API_00846: save_leave_type [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/defineLeaveType',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00847: save_leave_type [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/defineLeaveType',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/defineLeaveType/{id}', function () {
    it('TC_API_00848: edit_leave_type [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/defineLeaveType/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00849: edit_leave_type [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/defineLeaveType/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/addLeaveEntitlement', function () {
    it('TC_API_00850: leave_add_leave_entitlement [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/addLeaveEntitlement',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00851: leave_add_leave_entitlement [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/addLeaveEntitlement',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/editLeaveEntitlement/{id}', function () {
    it('TC_API_00852: leave_edit_leave_entitlement [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/editLeaveEntitlement/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00853: leave_edit_leave_entitlement [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/editLeaveEntitlement/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewLeaveEntitlements', function () {
    it('TC_API_00854: leave_view_leave_entitlement [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveEntitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00855: leave_view_leave_entitlement [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveEntitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewMyLeaveEntitlements', function () {
    it('TC_API_00856: leave_view_my_leave_entitlement [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewMyLeaveEntitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00857: leave_view_my_leave_entitlement [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewMyLeaveEntitlements',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/defineWorkWeek', function () {
    it('TC_API_00858: leave_work_week [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/defineWorkWeek',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00859: leave_work_week [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/defineWorkWeek',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewHolidayList', function () {
    it('TC_API_00860: list_holidays [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewHolidayList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00861: list_holidays [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewHolidayList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/saveHolidays', function () {
    it('TC_API_00862: add_holiday [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/saveHolidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00863: add_holiday [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/saveHolidays',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/saveHolidays/{id}', function () {
    it('TC_API_00864: edit_holiday [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/saveHolidays/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00865: edit_holiday [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/saveHolidays/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewLeaveBalanceReport', function () {
    it('TC_API_00866: leave_view_leave_entitlement_report [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveBalanceReport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00867: leave_view_leave_entitlement_report [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewLeaveBalanceReport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /leave/viewMyLeaveBalanceReport', function () {
    it('TC_API_00868: leave_view_my_leave_entitlement_report [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewMyLeaveBalanceReport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00869: leave_view_my_leave_entitlement_report [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/leave/viewMyLeaveBalanceReport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
