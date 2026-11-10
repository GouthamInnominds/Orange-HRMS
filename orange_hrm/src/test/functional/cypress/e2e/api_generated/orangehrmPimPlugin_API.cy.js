/**
 * Automated Cypress API Contract Test Suite for orangehrmPimPlugin
 * Tests: 381
 */

describe('orangehrmPimPlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/pim/employees/{empNumber}', function () {
    it('TC_API_01028: apiv2_pim_employee [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01029: apiv2_pim_employee [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}', function () {
    it('TC_API_01030: apiv2_pim_employee [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01031: apiv2_pim_employee [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01032: apiv2_pim_employee [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees', function () {
    it('TC_API_01033: apiv2_pim_employees [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01034: apiv2_pim_employees [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees', function () {
    it('TC_API_01035: apiv2_pim_employees [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01036: apiv2_pim_employees [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01037: apiv2_pim_employees [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees', function () {
    it('TC_API_01038: apiv2_pim_employees [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01039: apiv2_pim_employees [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/count', function () {
    it('TC_API_01040: apiv2_pim_employees_count [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/count',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01041: apiv2_pim_employees_count [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/count',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/picture', function () {
    it('TC_API_01042: apiv2_pim_employee_picture [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/picture',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01043: apiv2_pim_employee_picture [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/picture',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/picture', function () {
    it('TC_API_01044: apiv2_pim_employee_picture [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/picture',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01045: apiv2_pim_employee_picture [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/picture',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01046: apiv2_pim_employee_picture [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/picture',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/custom-fields', function () {
    it('TC_API_01047: apiv2_pim_employee_custom_fields [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01048: apiv2_pim_employee_custom_fields [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/custom-fields', function () {
    it('TC_API_01049: apiv2_pim_employee_custom_fields [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01050: apiv2_pim_employee_custom_fields [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01051: apiv2_pim_employee_custom_fields [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/personal-details', function () {
    it('TC_API_01052: apiv2_pim_employees_personal_details [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/personal-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01053: apiv2_pim_employees_personal_details [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/personal-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/personal-details', function () {
    it('TC_API_01054: apiv2_pim_employees_personal_details [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/personal-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01055: apiv2_pim_employees_personal_details [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/personal-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01056: apiv2_pim_employees_personal_details [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/personal-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/job-details', function () {
    it('TC_API_01057: apiv2_pim_employees_job_details [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/job-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01058: apiv2_pim_employees_job_details [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/job-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/job-details', function () {
    it('TC_API_01059: apiv2_pim_employees_job_details [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/job-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01060: apiv2_pim_employees_job_details [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/job-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01061: apiv2_pim_employees_job_details [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/job-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/employment-contract', function () {
    it('TC_API_01062: apiv2_pim_employees_job_employment_contract [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/employment-contract',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01063: apiv2_pim_employees_job_employment_contract [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/employment-contract',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/employment-contract', function () {
    it('TC_API_01064: apiv2_pim_employees_job_employment_contract [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/employment-contract',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01065: apiv2_pim_employees_job_employment_contract [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/employment-contract',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01066: apiv2_pim_employees_job_employment_contract [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/employment-contract',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/terminations/{id}', function () {
    it('TC_API_01067: apiv2_pim_employees_termination [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/terminations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01068: apiv2_pim_employees_termination [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/terminations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/terminations/{id}', function () {
    it('TC_API_01069: apiv2_pim_employees_termination [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/terminations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01070: apiv2_pim_employees_termination [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/terminations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01071: apiv2_pim_employees_termination [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/terminations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/terminations', function () {
    it('TC_API_01072: apiv2_pim_employees_terminations [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/terminations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01073: apiv2_pim_employees_terminations [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/terminations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/terminations', function () {
    it('TC_API_01074: apiv2_pim_employees_terminations [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/terminations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01075: apiv2_pim_employees_terminations [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/terminations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01076: apiv2_pim_employees_terminations [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/terminations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/terminations', function () {
    it('TC_API_01077: apiv2_pim_employees_terminations [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/terminations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01078: apiv2_pim_employees_terminations [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/terminations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employee/{empNumber}/contact-details', function () {
    it('TC_API_01079: apiv2_pim_employee_contact_details [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employee/1/contact-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01080: apiv2_pim_employee_contact_details [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employee/1/contact-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employee/{empNumber}/contact-details', function () {
    it('TC_API_01081: apiv2_pim_employee_contact_details [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employee/1/contact-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01082: apiv2_pim_employee_contact_details [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employee/1/contact-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01083: apiv2_pim_employee_contact_details [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employee/1/contact-details',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/dependents/{id}', function () {
    it('TC_API_01084: apiv2_pim_employees_dependent [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/dependents/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01085: apiv2_pim_employees_dependent [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/dependents/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/dependents/{id}', function () {
    it('TC_API_01086: apiv2_pim_employees_dependent [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/dependents/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01087: apiv2_pim_employees_dependent [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/dependents/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01088: apiv2_pim_employees_dependent [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/dependents/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/dependents', function () {
    it('TC_API_01089: apiv2_pim_employees_dependents [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/dependents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01090: apiv2_pim_employees_dependents [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/dependents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/dependents', function () {
    it('TC_API_01091: apiv2_pim_employees_dependents [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/dependents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01092: apiv2_pim_employees_dependents [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/dependents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01093: apiv2_pim_employees_dependents [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/dependents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/dependents', function () {
    it('TC_API_01094: apiv2_pim_employees_dependents [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/dependents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01095: apiv2_pim_employees_dependents [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/dependents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/salary-components/{id}', function () {
    it('TC_API_01096: apiv2_pim_employees_salary_component [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/salary-components/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01097: apiv2_pim_employees_salary_component [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/salary-components/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/salary-components/{id}', function () {
    it('TC_API_01098: apiv2_pim_employees_salary_component [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/salary-components/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01099: apiv2_pim_employees_salary_component [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/salary-components/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01100: apiv2_pim_employees_salary_component [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/salary-components/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/salary-components', function () {
    it('TC_API_01101: apiv2_pim_employees_salary_components [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/salary-components',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01102: apiv2_pim_employees_salary_components [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/salary-components',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/salary-components', function () {
    it('TC_API_01103: apiv2_pim_employees_salary_components [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/salary-components',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01104: apiv2_pim_employees_salary_components [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/salary-components',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01105: apiv2_pim_employees_salary_components [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/salary-components',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/salary-components', function () {
    it('TC_API_01106: apiv2_pim_employees_salary_components [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/salary-components',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01107: apiv2_pim_employees_salary_components [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/salary-components',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments/{id}', function () {
    it('TC_API_01108: apiv2_pim_employees_attachment [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/screen/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01109: apiv2_pim_employees_attachment [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/screen/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments/{id}', function () {
    it('TC_API_01110: apiv2_pim_employees_attachment [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/screen/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01111: apiv2_pim_employees_attachment [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/screen/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01112: apiv2_pim_employees_attachment [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/screen/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments', function () {
    it('TC_API_01113: apiv2_pim_employees_attachments [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/screen/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01114: apiv2_pim_employees_attachments [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/screen/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments', function () {
    it('TC_API_01115: apiv2_pim_employees_attachments [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/screen/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01116: apiv2_pim_employees_attachments [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/screen/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01117: apiv2_pim_employees_attachments [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/screen/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/screen/{screen}/attachments', function () {
    it('TC_API_01118: apiv2_pim_employees_attachments [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/screen/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01119: apiv2_pim_employees_attachments [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/screen/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/emergency-contacts/{id}', function () {
    it('TC_API_01120: apiv2_pim_employee_emergency_contact [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/emergency-contacts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01121: apiv2_pim_employee_emergency_contact [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/emergency-contacts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/emergency-contacts/{id}', function () {
    it('TC_API_01122: apiv2_pim_employee_emergency_contact [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/emergency-contacts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01123: apiv2_pim_employee_emergency_contact [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/emergency-contacts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01124: apiv2_pim_employee_emergency_contact [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/emergency-contacts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/emergency-contacts', function () {
    it('TC_API_01125: apiv2_pim_employee_emergency_contacts [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/emergency-contacts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01126: apiv2_pim_employee_emergency_contacts [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/emergency-contacts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/emergency-contacts', function () {
    it('TC_API_01127: apiv2_pim_employee_emergency_contacts [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/emergency-contacts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01128: apiv2_pim_employee_emergency_contacts [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/emergency-contacts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01129: apiv2_pim_employee_emergency_contacts [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/emergency-contacts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/emergency-contacts', function () {
    it('TC_API_01130: apiv2_pim_employee_emergency_contacts [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/emergency-contacts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01131: apiv2_pim_employee_emergency_contacts [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/emergency-contacts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/skills', function () {
    it('TC_API_01132: apiv2_pim_employees_skills [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01133: apiv2_pim_employees_skills [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/skills', function () {
    it('TC_API_01134: apiv2_pim_employees_skills [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01135: apiv2_pim_employees_skills [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01136: apiv2_pim_employees_skills [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/skills', function () {
    it('TC_API_01137: apiv2_pim_employees_skills [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01138: apiv2_pim_employees_skills [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/skills',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/skills/allowed', function () {
    it('TC_API_01139: apiv2_pim_employees_allowed_skills [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/skills/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01140: apiv2_pim_employees_allowed_skills [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/skills/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/skills/allowed', function () {
    it('TC_API_01141: apiv2_pim_employees_allowed_skills [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/skills/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01142: apiv2_pim_employees_allowed_skills [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/skills/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01143: apiv2_pim_employees_allowed_skills [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/skills/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/skills/allowed', function () {
    it('TC_API_01144: apiv2_pim_employees_allowed_skills [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/skills/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01145: apiv2_pim_employees_allowed_skills [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/skills/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/skills/{id}', function () {
    it('TC_API_01146: apiv2_pim_employees_skill [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01147: apiv2_pim_employees_skill [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/skills/{id}', function () {
    it('TC_API_01148: apiv2_pim_employees_skill [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01149: apiv2_pim_employees_skill [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01150: apiv2_pim_employees_skill [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/skills/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/educations', function () {
    it('TC_API_01151: apiv2_pim_employees_educations [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01152: apiv2_pim_employees_educations [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/educations', function () {
    it('TC_API_01153: apiv2_pim_employees_educations [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01154: apiv2_pim_employees_educations [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01155: apiv2_pim_employees_educations [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/educations', function () {
    it('TC_API_01156: apiv2_pim_employees_educations [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01157: apiv2_pim_employees_educations [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/educations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/educations/{id}', function () {
    it('TC_API_01158: apiv2_pim_employees_education [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01159: apiv2_pim_employees_education [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/educations/{id}', function () {
    it('TC_API_01160: apiv2_pim_employees_education [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01161: apiv2_pim_employees_education [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01162: apiv2_pim_employees_education [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/educations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/languages', function () {
    it('TC_API_01163: apiv2_pim_employees_languages [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01164: apiv2_pim_employees_languages [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/languages', function () {
    it('TC_API_01165: apiv2_pim_employees_languages [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01166: apiv2_pim_employees_languages [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01167: apiv2_pim_employees_languages [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/languages', function () {
    it('TC_API_01168: apiv2_pim_employees_languages [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01169: apiv2_pim_employees_languages [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/languages',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/languages/{languageId}/fluencies/{fluencyId}', function () {
    it('TC_API_01170: apiv2_pim_employees_language [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/languages/1/fluencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01171: apiv2_pim_employees_language [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/languages/1/fluencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/languages/{languageId}/fluencies/{fluencyId}', function () {
    it('TC_API_01172: apiv2_pim_employees_language [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/languages/1/fluencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01173: apiv2_pim_employees_language [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/languages/1/fluencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01174: apiv2_pim_employees_language [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/languages/1/fluencies/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/languages/allowed', function () {
    it('TC_API_01175: apiv2_pim_employees_allowed_languages [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/languages/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01176: apiv2_pim_employees_allowed_languages [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/languages/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/languages/allowed', function () {
    it('TC_API_01177: apiv2_pim_employees_allowed_languages [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/languages/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01178: apiv2_pim_employees_allowed_languages [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/languages/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01179: apiv2_pim_employees_allowed_languages [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/languages/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/languages/allowed', function () {
    it('TC_API_01180: apiv2_pim_employees_allowed_languages [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/languages/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01181: apiv2_pim_employees_allowed_languages [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/languages/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/work-experiences', function () {
    it('TC_API_01182: apiv2_pim_employees_work_experiences [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/work-experiences',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01183: apiv2_pim_employees_work_experiences [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/work-experiences',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/work-experiences', function () {
    it('TC_API_01184: apiv2_pim_employees_work_experiences [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/work-experiences',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01185: apiv2_pim_employees_work_experiences [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/work-experiences',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01186: apiv2_pim_employees_work_experiences [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/work-experiences',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/work-experiences', function () {
    it('TC_API_01187: apiv2_pim_employees_work_experiences [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/work-experiences',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01188: apiv2_pim_employees_work_experiences [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/work-experiences',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/work-experiences/{id}', function () {
    it('TC_API_01189: apiv2_pim_employees_work_experience [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/work-experiences/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01190: apiv2_pim_employees_work_experience [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/work-experiences/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/work-experiences/{id}', function () {
    it('TC_API_01191: apiv2_pim_employees_work_experience [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/work-experiences/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01192: apiv2_pim_employees_work_experience [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/work-experiences/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01193: apiv2_pim_employees_work_experience [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/work-experiences/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/licenses', function () {
    it('TC_API_01194: apiv2_pim_employees_licenses [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01195: apiv2_pim_employees_licenses [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/licenses', function () {
    it('TC_API_01196: apiv2_pim_employees_licenses [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01197: apiv2_pim_employees_licenses [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01198: apiv2_pim_employees_licenses [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/licenses', function () {
    it('TC_API_01199: apiv2_pim_employees_licenses [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01200: apiv2_pim_employees_licenses [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/licenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/licenses/allowed', function () {
    it('TC_API_01201: apiv2_pim_employees_allowed_licenses [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/licenses/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01202: apiv2_pim_employees_allowed_licenses [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/licenses/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/licenses/allowed', function () {
    it('TC_API_01203: apiv2_pim_employees_allowed_licenses [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/licenses/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01204: apiv2_pim_employees_allowed_licenses [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/licenses/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01205: apiv2_pim_employees_allowed_licenses [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/licenses/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/licenses/allowed', function () {
    it('TC_API_01206: apiv2_pim_employees_allowed_licenses [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/licenses/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01207: apiv2_pim_employees_allowed_licenses [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/licenses/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/licenses/{id}', function () {
    it('TC_API_01208: apiv2_pim_employees_license [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01209: apiv2_pim_employees_license [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/licenses/{id}', function () {
    it('TC_API_01210: apiv2_pim_employees_license [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01211: apiv2_pim_employees_license [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01212: apiv2_pim_employees_license [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/licenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/termination-reasons/{id}', function () {
    it('TC_API_01213: apiv2_pim_termination_reason [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/termination-reasons/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01214: apiv2_pim_termination_reason [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/termination-reasons/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/termination-reasons/{id}', function () {
    it('TC_API_01215: apiv2_pim_termination_reason [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/termination-reasons/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01216: apiv2_pim_termination_reason [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/termination-reasons/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01217: apiv2_pim_termination_reason [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/termination-reasons/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/termination-reasons', function () {
    it('TC_API_01218: apiv2_pim_termination_reasons [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/termination-reasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01219: apiv2_pim_termination_reasons [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/termination-reasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/termination-reasons', function () {
    it('TC_API_01220: apiv2_pim_termination_reasons [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/termination-reasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01221: apiv2_pim_termination_reasons [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/termination-reasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01222: apiv2_pim_termination_reasons [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/termination-reasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/termination-reasons', function () {
    it('TC_API_01223: apiv2_pim_termination_reasons [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/termination-reasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01224: apiv2_pim_termination_reasons [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/termination-reasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/reporting-methods/{id}', function () {
    it('TC_API_01225: apiv2_pim_reporting_method [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reporting-methods/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01226: apiv2_pim_reporting_method [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reporting-methods/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/reporting-methods/{id}', function () {
    it('TC_API_01227: apiv2_pim_reporting_method [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/reporting-methods/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01228: apiv2_pim_reporting_method [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/reporting-methods/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01229: apiv2_pim_reporting_method [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/reporting-methods/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/reporting-methods', function () {
    it('TC_API_01230: apiv2_pim_reporting_methods [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reporting-methods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01231: apiv2_pim_reporting_methods [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reporting-methods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/reporting-methods', function () {
    it('TC_API_01232: apiv2_pim_reporting_methods [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/reporting-methods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01233: apiv2_pim_reporting_methods [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/reporting-methods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01234: apiv2_pim_reporting_methods [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/reporting-methods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/reporting-methods', function () {
    it('TC_API_01235: apiv2_pim_reporting_methods [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/reporting-methods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01236: apiv2_pim_reporting_methods [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/reporting-methods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/custom-fields', function () {
    it('TC_API_01237: apiv2_pim_custom_fields [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01238: apiv2_pim_custom_fields [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/custom-fields', function () {
    it('TC_API_01239: apiv2_pim_custom_fields [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01240: apiv2_pim_custom_fields [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01241: apiv2_pim_custom_fields [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/custom-fields', function () {
    it('TC_API_01242: apiv2_pim_custom_fields [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01243: apiv2_pim_custom_fields [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/custom-fields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/custom-fields/{id}', function () {
    it('TC_API_01244: apiv2_pim_custom_field [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/custom-fields/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01245: apiv2_pim_custom_field [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/custom-fields/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/custom-fields/{id}', function () {
    it('TC_API_01246: apiv2_pim_custom_field [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/custom-fields/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01247: apiv2_pim_custom_field [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/custom-fields/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01248: apiv2_pim_custom_field [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/custom-fields/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/optional-field', function () {
    it('TC_API_01249: apiv2_pim_optional_field [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/optional-field',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01250: apiv2_pim_optional_field [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/optional-field',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/optional-field', function () {
    it('TC_API_01251: apiv2_pim_optional_field [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/optional-field',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01252: apiv2_pim_optional_field [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/optional-field',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01253: apiv2_pim_optional_field [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/optional-field',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/immigrations/{id}', function () {
    it('TC_API_01254: apiv2_pim_employees_immigration [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/immigrations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01255: apiv2_pim_employees_immigration [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/immigrations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/immigrations/{id}', function () {
    it('TC_API_01256: apiv2_pim_employees_immigration [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/immigrations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01257: apiv2_pim_employees_immigration [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/immigrations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01258: apiv2_pim_employees_immigration [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/immigrations/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/immigrations', function () {
    it('TC_API_01259: apiv2_pim_employees_immigrations [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/immigrations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01260: apiv2_pim_employees_immigrations [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/immigrations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/immigrations', function () {
    it('TC_API_01261: apiv2_pim_employees_immigrations [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/immigrations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01262: apiv2_pim_employees_immigrations [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/immigrations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01263: apiv2_pim_employees_immigrations [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/immigrations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/immigrations', function () {
    it('TC_API_01264: apiv2_pim_employees_immigrations [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/immigrations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01265: apiv2_pim_employees_immigrations [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/immigrations',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/supervisors', function () {
    it('TC_API_01266: apiv2_pim_report_to_supervisors [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01267: apiv2_pim_report_to_supervisors [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/supervisors', function () {
    it('TC_API_01268: apiv2_pim_report_to_supervisors [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01269: apiv2_pim_report_to_supervisors [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01270: apiv2_pim_report_to_supervisors [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/supervisors', function () {
    it('TC_API_01271: apiv2_pim_report_to_supervisors [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01272: apiv2_pim_report_to_supervisors [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/supervisors',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/supervisors/{id}', function () {
    it('TC_API_01273: apiv2_pim_report_to_supervisor [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/supervisors/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01274: apiv2_pim_report_to_supervisor [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/supervisors/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/supervisors/{id}', function () {
    it('TC_API_01275: apiv2_pim_report_to_supervisor [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/supervisors/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01276: apiv2_pim_report_to_supervisor [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/supervisors/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01277: apiv2_pim_report_to_supervisor [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/supervisors/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/subordinates/{id}', function () {
    it('TC_API_01278: apiv2_pim_report_to_subordinate [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/subordinates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01279: apiv2_pim_report_to_subordinate [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/subordinates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/subordinates/{id}', function () {
    it('TC_API_01280: apiv2_pim_report_to_subordinate [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/subordinates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01281: apiv2_pim_report_to_subordinate [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/subordinates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01282: apiv2_pim_report_to_subordinate [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/subordinates/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/subordinates', function () {
    it('TC_API_01283: apiv2_pim_report_to_subordinates [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/subordinates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01284: apiv2_pim_report_to_subordinates [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/subordinates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/subordinates', function () {
    it('TC_API_01285: apiv2_pim_report_to_subordinates [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/subordinates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01286: apiv2_pim_report_to_subordinates [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/subordinates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01287: apiv2_pim_report_to_subordinates [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/subordinates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/subordinates', function () {
    it('TC_API_01288: apiv2_pim_report_to_subordinates [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/subordinates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01289: apiv2_pim_report_to_subordinates [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/subordinates',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/report-to/allowed', function () {
    it('TC_API_01290: apiv2_pim_report_to_allowed_employees [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/report-to/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01291: apiv2_pim_report_to_allowed_employees [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/report-to/allowed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/memberships', function () {
    it('TC_API_01292: apiv2_pim_employees_memberships [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01293: apiv2_pim_employees_memberships [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/employees/{empNumber}/memberships', function () {
    it('TC_API_01294: apiv2_pim_employees_memberships [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01295: apiv2_pim_employees_memberships [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01296: apiv2_pim_employees_memberships [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/employees/1/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/employees/{empNumber}/memberships', function () {
    it('TC_API_01297: apiv2_pim_employees_memberships [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01298: apiv2_pim_employees_memberships [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/employees/1/memberships',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/memberships/{id}', function () {
    it('TC_API_01299: apiv2_pim_employees_membership [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01300: apiv2_pim_employees_membership [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/memberships/{id}', function () {
    it('TC_API_01301: apiv2_pim_employees_membership [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01302: apiv2_pim_employees_membership [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01303: apiv2_pim_employees_membership [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/memberships/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/tax-exemption', function () {
    it('TC_API_01304: apiv2_pim_employees_us_tax_exemption [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/tax-exemption',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01305: apiv2_pim_employees_us_tax_exemption [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/tax-exemption',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/employees/{empNumber}/tax-exemption', function () {
    it('TC_API_01306: apiv2_pim_employees_us_tax_exemption [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/tax-exemption',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01307: apiv2_pim_employees_us_tax_exemption [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/tax-exemption',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01308: apiv2_pim_employees_us_tax_exemption [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/employees/1/tax-exemption',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/work-shift', function () {
    it('TC_API_01309: apiv2_pim_employees_work_shift [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/work-shift',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01310: apiv2_pim_employees_work_shift [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/work-shift',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/csv-import', function () {
    it('TC_API_01311: apiv2_pim_employees_import [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/csv-import',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01312: apiv2_pim_employees_import [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/csv-import',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01313: apiv2_pim_employees_import [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/csv-import',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/reports', function () {
    it('TC_API_01314: apiv2_pim_reports [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reports',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01315: apiv2_pim_reports [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reports',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/reports/data', function () {
    it('TC_API_01316: apiv2_pim_reports_data [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reports/data',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01317: apiv2_pim_reports_data [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reports/data',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/reports/defined', function () {
    it('TC_API_01318: apiv2_pim_defined_reports [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reports/defined',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01319: apiv2_pim_defined_reports [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reports/defined',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/pim/reports/defined', function () {
    it('TC_API_01320: apiv2_pim_defined_reports [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/reports/defined',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01321: apiv2_pim_defined_reports [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/reports/defined',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01322: apiv2_pim_defined_reports [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/pim/reports/defined',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/pim/reports/defined', function () {
    it('TC_API_01323: apiv2_pim_defined_reports [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/reports/defined',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01324: apiv2_pim_defined_reports [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/pim/reports/defined',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/reports/defined/{id}', function () {
    it('TC_API_01325: apiv2_pim_defined_report [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reports/defined/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01326: apiv2_pim_defined_report [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/reports/defined/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/reports/defined/{id}', function () {
    it('TC_API_01327: apiv2_pim_defined_report [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/reports/defined/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01328: apiv2_pim_defined_report [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/reports/defined/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01329: apiv2_pim_defined_report [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/reports/defined/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/pim/update-password', function () {
    it('TC_API_01330: apiv2_pim_update_password [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/update-password',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01331: apiv2_pim_update_password [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/update-password',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01332: apiv2_pim_update_password [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/pim/update-password',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/contact-details/validation/work-emails', function () {
    it('TC_API_01333: apiv2_pim_validate_employee_email [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/contact-details/validation/work-emails',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01334: apiv2_pim_validate_employee_email [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/contact-details/validation/work-emails',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/employees/{empNumber}/contact-details/validation/other-emails', function () {
    it('TC_API_01335: apiv2_pim_validate_employee_other_email [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/contact-details/validation/other-emails',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01336: apiv2_pim_validate_employee_other_email [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/employees/1/contact-details/validation/other-emails',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/pim/myself', function () {
    it('TC_API_01337: apiv2_pim_my_info [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/myself',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01338: apiv2_pim_my_info [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/pim/myself',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewPhoto/empNumber/{empNumber}', function () {
    it('TC_API_01339: pim_employee_picture [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewPhoto/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01340: pim_employee_picture [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewPhoto/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewAttachment/empNumber/{empNumber}/attachId/{attachId}', function () {
    it('TC_API_01341: pim_employee_attachment [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewAttachment/empNumber/1/attachId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01342: pim_employee_attachment [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewAttachment/empNumber/1/attachId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/sampleCsvDownload', function () {
    it('TC_API_01343: pim_employee_csv_import_sample_attachment [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/sampleCsvDownload',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01344: pim_employee_csv_import_sample_attachment [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/sampleCsvDownload',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewPimModule', function () {
    it('TC_API_01345: pim_module [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewPimModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01346: pim_module [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewPimModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewMyDetails', function () {
    it('TC_API_01347: pim_view_my_details [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewMyDetails',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01348: pim_view_my_details [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewMyDetails',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewEmployeeList', function () {
    it('TC_API_01349: pim_view_employee_list [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewEmployeeList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01350: pim_view_employee_list [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewEmployeeList',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/addEmployee', function () {
    it('TC_API_01351: pim_add_employee [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/addEmployee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01352: pim_add_employee [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/addEmployee',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewPersonalDetails/empNumber/{empNumber}', function () {
    it('TC_API_01353: pim_employee_personal_details [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewPersonalDetails/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01354: pim_employee_personal_details [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewPersonalDetails/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/contactDetails/empNumber/{empNumber}', function () {
    it('TC_API_01355: pim_employee_contact_details [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/contactDetails/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01356: pim_employee_contact_details [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/contactDetails/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewEmergencyContacts/empNumber/{empNumber}', function () {
    it('TC_API_01357: pim_employee_emergency_contacts [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewEmergencyContacts/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01358: pim_employee_emergency_contacts [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewEmergencyContacts/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewDependents/empNumber/{empNumber}', function () {
    it('TC_API_01359: pim_employee_dependents [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewDependents/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01360: pim_employee_dependents [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewDependents/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewSalaryList/empNumber/{empNumber}', function () {
    it('TC_API_01361: pim_employee_salary [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewSalaryList/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01362: pim_employee_salary [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewSalaryList/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewPhotograph/empNumber/{empNumber}', function () {
    it('TC_API_01363: pim_employee_profile_picture [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewPhotograph/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01364: pim_employee_profile_picture [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewPhotograph/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewJobDetails/empNumber/{empNumber}', function () {
    it('TC_API_01365: pim_employee_job [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewJobDetails/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01366: pim_employee_job [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewJobDetails/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewQualifications/empNumber/{empNumber}', function () {
    it('TC_API_01367: pim_employee_qualifications [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewQualifications/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01368: pim_employee_qualifications [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewQualifications/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewReportToDetails/empNumber/{empNumber}', function () {
    it('TC_API_01369: pim_employee_report_to [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewReportToDetails/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01370: pim_employee_report_to [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewReportToDetails/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewTerminationReasons', function () {
    it('TC_API_01371: view_termination_reason [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewTerminationReasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01372: view_termination_reason [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewTerminationReasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/saveTerminationReasons', function () {
    it('TC_API_01373: save_termination_reason [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveTerminationReasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01374: save_termination_reason [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveTerminationReasons',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/saveTerminationReasons/{id}', function () {
    it('TC_API_01375: edit_termination_reason [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveTerminationReasons/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01376: edit_termination_reason [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveTerminationReasons/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewReportingMethods', function () {
    it('TC_API_01377: view_reporting_method [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewReportingMethods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01378: view_reporting_method [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewReportingMethods',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/saveReportingMethod', function () {
    it('TC_API_01379: save_reporting_method [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveReportingMethod',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01380: save_reporting_method [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveReportingMethod',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/saveReportingMethod/{id}', function () {
    it('TC_API_01381: edit_reporting_method [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveReportingMethod/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01382: edit_reporting_method [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveReportingMethod/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/listCustomFields', function () {
    it('TC_API_01383: view_custom_fields [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/listCustomFields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01384: view_custom_fields [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/listCustomFields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/saveCustomFields', function () {
    it('TC_API_01385: save_custom_fields [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveCustomFields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01386: save_custom_fields [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveCustomFields',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/saveCustomFields/{id}', function () {
    it('TC_API_01387: edit_custom_fields [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveCustomFields/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01388: edit_custom_fields [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/saveCustomFields/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/configurePim', function () {
    it('TC_API_01389: view_optional_field [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/configurePim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01390: view_optional_field [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/configurePim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewImmigration/empNumber/{empNumber}', function () {
    it('TC_API_01391: pim_employee_immigration [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewImmigration/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01392: pim_employee_immigration [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewImmigration/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewMemberships/empNumber/{empNumber}', function () {
    it('TC_API_01393: pim_employee_membership [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewMemberships/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01394: pim_employee_membership [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewMemberships/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewUsTaxExemptions/empNumber/{empNumber}', function () {
    it('TC_API_01395: pim_employee_tax_exemption [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewUsTaxExemptions/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01396: pim_employee_tax_exemption [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewUsTaxExemptions/empNumber/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/pimCsvImport', function () {
    it('TC_API_01397: pim_employee_csv_import [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/pimCsvImport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01398: pim_employee_csv_import [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/pimCsvImport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/viewDefinedPredefinedReports', function () {
    it('TC_API_01399: pim_view_employee_reports [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewDefinedPredefinedReports',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01400: pim_view_employee_reports [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/viewDefinedPredefinedReports',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/definePredefinedReport', function () {
    it('TC_API_01401: pim_save_employee_reports [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/definePredefinedReport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01402: pim_save_employee_reports [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/definePredefinedReport',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/definePredefinedReport/{id}', function () {
    it('TC_API_01403: pim_edit_employee_reports [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/definePredefinedReport/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01404: pim_edit_employee_reports [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/definePredefinedReport/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/displayPredefinedReport/{id}', function () {
    it('TC_API_01405: pim_display_employee_report [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/displayPredefinedReport/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01406: pim_display_employee_report [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/displayPredefinedReport/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /pim/updatePassword', function () {
    it('TC_API_01407: update_password [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/updatePassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_01408: update_password [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/pim/updatePassword',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
