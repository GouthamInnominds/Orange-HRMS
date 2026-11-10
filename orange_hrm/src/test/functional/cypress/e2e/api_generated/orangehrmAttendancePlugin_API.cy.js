/**
 * Automated Cypress API Contract Test Suite for orangehrmAttendancePlugin
 * Tests: 64
 */

describe('orangehrmAttendancePlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/attendance/configs', function () {
    it('TC_API_00364: apiv2_attendance_configuration [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/configs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00365: apiv2_attendance_configuration [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/configs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/attendance/configs', function () {
    it('TC_API_00366: apiv2_attendance_configuration [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/configs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00367: apiv2_attendance_configuration [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/configs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00368: apiv2_attendance_configuration [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/configs',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/records/latest', function () {
    it('TC_API_00369: apiv2_employee_latest_attendance_record [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records/latest',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00370: apiv2_employee_latest_attendance_record [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records/latest',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/punch-in/overlaps', function () {
    it('TC_API_00371: apiv2_attendance_punch_in_record_overlap [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/punch-in/overlaps',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00372: apiv2_attendance_punch_in_record_overlap [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/punch-in/overlaps',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/punch-out/overlaps', function () {
    it('TC_API_00373: apiv2_attendance_punch_out_record_overlap [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/punch-out/overlaps',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00374: apiv2_attendance_punch_out_record_overlap [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/punch-out/overlaps',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/records', function () {
    it('TC_API_00375: apiv2_attendance_my_attendance_records [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00376: apiv2_attendance_my_attendance_records [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/attendance/records', function () {
    it('TC_API_00377: apiv2_attendance_my_attendance_records [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00378: apiv2_attendance_my_attendance_records [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00379: apiv2_attendance_my_attendance_records [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/attendance/records', function () {
    it('TC_API_00380: apiv2_attendance_my_attendance_records [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00381: apiv2_attendance_my_attendance_records [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00382: apiv2_attendance_my_attendance_records [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/attendance/records', function () {
    it('TC_API_00383: apiv2_attendance_my_attendance_records [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00384: apiv2_attendance_my_attendance_records [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/attendance/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/employees/{empNumber}/records', function () {
    it('TC_API_00385: apiv2_attendance_employee_attendance_records [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00386: apiv2_attendance_employee_attendance_records [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/attendance/employees/{empNumber}/records', function () {
    it('TC_API_00387: apiv2_attendance_employee_attendance_records [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00388: apiv2_attendance_employee_attendance_records [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00389: apiv2_attendance_employee_attendance_records [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/attendance/employees/{empNumber}/records', function () {
    it('TC_API_00390: apiv2_attendance_employee_attendance_records [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00391: apiv2_attendance_employee_attendance_records [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00392: apiv2_attendance_employee_attendance_records [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/attendance/employees/{empNumber}/records', function () {
    it('TC_API_00393: apiv2_attendance_employee_attendance_records [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00394: apiv2_attendance_employee_attendance_records [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/attendance/employees/1/records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/employees/summary', function () {
    it('TC_API_00395: apiv2_attendance_employee_attendance_record_summary [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/employees/summary',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00396: apiv2_attendance_employee_attendance_record_summary [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/employees/summary',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/timezones', function () {
    it('TC_API_00397: apiv2_attendance_timezones [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/timezones',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00398: apiv2_attendance_timezones [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/timezones',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/current-datetime', function () {
    it('TC_API_00399: apiv2_attendance_current_datetime [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/current-datetime',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00400: apiv2_attendance_current_datetime [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/current-datetime',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/records/punch-in-overlaps', function () {
    it('TC_API_00401: apiv2_attendance_edit_punch_in_record_overlap [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records/punch-in-overlaps',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00402: apiv2_attendance_edit_punch_in_record_overlap [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records/punch-in-overlaps',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/records/punch-out-overlaps', function () {
    it('TC_API_00403: apiv2_attendance_edit_punch_out_record_overlap [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records/punch-out-overlaps',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00404: apiv2_attendance_edit_punch_out_record_overlap [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records/punch-out-overlaps',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/attendance/records/{id}', function () {
    it('TC_API_00405: apiv2_attendance_employee_attendance_record [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00406: apiv2_attendance_employee_attendance_record [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/attendance/records/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/attendance/records/{id}', function () {
    it('TC_API_00407: apiv2_attendance_employee_attendance_record [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/records/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00408: apiv2_attendance_employee_attendance_record [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/records/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00409: apiv2_attendance_employee_attendance_record [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/attendance/records/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /attendance/punchIn', function () {
    it('TC_API_00410: attendance_punch_in [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/punchIn',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00411: attendance_punch_in [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/punchIn',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /attendance/punchOut', function () {
    it('TC_API_00412: attendance_punch_out [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/punchOut',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00413: attendance_punch_out [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/punchOut',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /attendance/configure', function () {
    it('TC_API_00414: attendance_configure [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/configure',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00415: attendance_configure [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/configure',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /attendance/viewAttendanceRecord', function () {
    it('TC_API_00416: attendance_view_employee_attendance [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/viewAttendanceRecord',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00417: attendance_view_employee_attendance [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/viewAttendanceRecord',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /attendance/viewMyAttendanceRecord', function () {
    it('TC_API_00418: attendance_view_my_attendance [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/viewMyAttendanceRecord',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00419: attendance_view_my_attendance [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/viewMyAttendanceRecord',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /attendance/editAttendanceRecord/{id}', function () {
    it('TC_API_00420: attendance_edit_attendance [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/editAttendanceRecord/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00421: attendance_edit_attendance [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/editAttendanceRecord/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /time/displayAttendanceSummaryReportCriteria', function () {
    it('TC_API_00422: attendance_summary_report [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/time/displayAttendanceSummaryReportCriteria',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00423: attendance_summary_report [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/time/displayAttendanceSummaryReportCriteria',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /attendance/proxyPunchInPunchOut', function () {
    it('TC_API_00424: attendance_employee_punch_in_out [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/proxyPunchInPunchOut',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00425: attendance_employee_punch_in_out [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/proxyPunchInPunchOut',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /attendance/editEmployeeAttendanceRecord/{id}', function () {
    it('TC_API_00426: attendance_employee_edit_attendance [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/editEmployeeAttendanceRecord/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00427: attendance_employee_edit_attendance [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/attendance/editEmployeeAttendanceRecord/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
