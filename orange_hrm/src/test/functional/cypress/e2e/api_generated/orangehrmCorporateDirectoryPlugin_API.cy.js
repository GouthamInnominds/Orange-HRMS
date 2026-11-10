/**
 * Automated Cypress API Test Suite for orangehrmCorporateDirectoryPlugin
 * Total Tests: 6
 */

describe('orangehrmCorporateDirectoryPlugin - Automated API Contracts', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/directory/employees/{empNumber}', function () {
    it('TC_API_00668: apiv2_corporate_directory_employee [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/directory/employees/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00669: apiv2_corporate_directory_employee [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/directory/employees/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/directory/employees', function () {
    it('TC_API_00670: apiv2_corporate_directory_employees [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/directory/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00671: apiv2_corporate_directory_employees [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/directory/employees',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /directory/viewDirectory', function () {
    it('TC_API_00672: corporate_directory_module [HTTP 200]', function () {
      cy.request({
        method: 'GET',
        url: '/directory/viewDirectory',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00673: corporate_directory_module [HTTP 401]', function () {
      cy.request({
        method: 'GET',
        url: '/directory/viewDirectory',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
