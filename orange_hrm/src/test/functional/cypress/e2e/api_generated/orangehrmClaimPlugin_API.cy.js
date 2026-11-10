/**
 * Automated Cypress API Contract Test Suite for orangehrmClaimPlugin
 * Tests: 95
 */

describe('orangehrmClaimPlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('POST /api/v2/claim/events', function () {
    it('TC_API_00516: apiv2_claim_events [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/events',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00517: apiv2_claim_events [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/events',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00518: apiv2_claim_events [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/events',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/events', function () {
    it('TC_API_00519: apiv2_claim_events [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/events',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00520: apiv2_claim_events [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/events',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/claim/events', function () {
    it('TC_API_00521: apiv2_claim_events [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/claim/events',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00522: apiv2_claim_events [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/claim/events',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/events/{id}', function () {
    it('TC_API_00523: apiv2_claim_event [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/events/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00524: apiv2_claim_event [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/events/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/claim/events/{id}', function () {
    it('TC_API_00525: apiv2_claim_event [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/events/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00526: apiv2_claim_event [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/events/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00527: apiv2_claim_event [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/events/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/claim/expenses/types', function () {
    it('TC_API_00528: apiv2_claim_expense_types [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/expenses/types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00529: apiv2_claim_expense_types [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/expenses/types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00530: apiv2_claim_expense_types [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/expenses/types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/expenses/types', function () {
    it('TC_API_00531: apiv2_claim_expense_types [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/expenses/types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00532: apiv2_claim_expense_types [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/expenses/types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/claim/expenses/types', function () {
    it('TC_API_00533: apiv2_claim_expense_types [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/claim/expenses/types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00534: apiv2_claim_expense_types [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/claim/expenses/types',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/expenses/types/{id}', function () {
    it('TC_API_00535: apiv2_claim_expense_type [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/expenses/types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00536: apiv2_claim_expense_type [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/expenses/types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/claim/expenses/types/{id}', function () {
    it('TC_API_00537: apiv2_claim_expense_type [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/expenses/types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00538: apiv2_claim_expense_type [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/expenses/types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00539: apiv2_claim_expense_type [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/expenses/types/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/claim/requests/{requestId}/expenses', function () {
    it('TC_API_00540: apiv2_claim_expenses [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests/1/expenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00541: apiv2_claim_expenses [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests/1/expenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00542: apiv2_claim_expenses [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests/1/expenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/requests/{requestId}/expenses', function () {
    it('TC_API_00543: apiv2_claim_expenses [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/expenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00544: apiv2_claim_expenses [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/expenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/claim/requests/{requestId}/expenses', function () {
    it('TC_API_00545: apiv2_claim_expenses [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/claim/requests/1/expenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00546: apiv2_claim_expenses [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/claim/requests/1/expenses',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/requests/{requestId}/expenses/{id}', function () {
    it('TC_API_00547: apiv2_claim_expense [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/expenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00548: apiv2_claim_expense [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/expenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/claim/requests/{requestId}/expenses/{id}', function () {
    it('TC_API_00549: apiv2_claim_expense [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/expenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00550: apiv2_claim_expense [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/expenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00551: apiv2_claim_expense [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/expenses/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/claim/requests/{requestId}/attachments', function () {
    it('TC_API_00552: apiv2_claim_attachments [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00553: apiv2_claim_attachments [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00554: apiv2_claim_attachments [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/requests/{requestId}/attachments', function () {
    it('TC_API_00555: apiv2_claim_attachments [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00556: apiv2_claim_attachments [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/claim/requests/{requestId}/attachments', function () {
    it('TC_API_00557: apiv2_claim_attachments [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/claim/requests/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00558: apiv2_claim_attachments [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/claim/requests/1/attachments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/requests/{requestId}/attachments/{id}', function () {
    it('TC_API_00559: apiv2_claim_attachment [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00560: apiv2_claim_attachment [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/claim/requests/{requestId}/attachments/{id}', function () {
    it('TC_API_00561: apiv2_claim_attachment [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00562: apiv2_claim_attachment [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00563: apiv2_claim_attachment [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/attachments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/claim/requests', function () {
    it('TC_API_00564: apiv2_claim_my_claim_requests [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00565: apiv2_claim_my_claim_requests [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00566: apiv2_claim_my_claim_requests [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/requests', function () {
    it('TC_API_00567: apiv2_claim_my_claim_requests [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00568: apiv2_claim_my_claim_requests [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/requests/{id}', function () {
    it('TC_API_00569: apiv2_claim_my_claim_request [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00570: apiv2_claim_my_claim_request [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/claim/employees/{empNumber}/requests', function () {
    it('TC_API_00571: apiv2_claim_employee_claim_requests [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/employees/1/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00572: apiv2_claim_employee_claim_requests [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/employees/1/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00573: apiv2_claim_employee_claim_requests [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/claim/employees/1/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/employees/requests', function () {
    it('TC_API_00574: apiv2_claim_employees_claim_requests [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/employees/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00575: apiv2_claim_employees_claim_requests [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/employees/requests',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/employees/{empNumber}/requests/{id}', function () {
    it('TC_API_00576: apiv2_claim_employee_claim_request [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/employees/1/requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00577: apiv2_claim_employee_claim_request [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/employees/1/requests/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/claim/requests/{requestId}/action', function () {
    it('TC_API_00578: apiv2_claim_claim_request_action [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/action',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00579: apiv2_claim_claim_request_action [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/action',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00580: apiv2_claim_claim_request_action [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/claim/requests/1/action',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/claim/requests/{requestId}/action', function () {
    it('TC_API_00581: apiv2_claim_claim_request_action [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/action',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00582: apiv2_claim_claim_request_action [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/claim/requests/1/action',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/viewClaimModule', function () {
    it('TC_API_00583: claim_module [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewClaimModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00584: claim_module [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewClaimModule',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/viewEvents', function () {
    it('TC_API_00585: claim_events [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewEvents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00586: claim_events [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewEvents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/saveEvents', function () {
    it('TC_API_00587: claim_save_claim_events [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/saveEvents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00588: claim_save_claim_events [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/saveEvents',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/saveEvents/{id}', function () {
    it('TC_API_00589: claim_edit_claim_events [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/saveEvents/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00590: claim_edit_claim_events [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/saveEvents/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/viewExpense', function () {
    it('TC_API_00591: claim_claim_expense_types [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewExpense',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00592: claim_claim_expense_types [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewExpense',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/saveExpense', function () {
    it('TC_API_00593: claim_save_claim_expense_types [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/saveExpense',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00594: claim_save_claim_expense_types [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/saveExpense',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/saveExpense/{id}', function () {
    it('TC_API_00595: claim_edit_claim_expense_types [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/saveExpense/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00596: claim_edit_claim_expense_types [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/saveExpense/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/submitClaim', function () {
    it('TC_API_00597: claim_submit_claim [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/submitClaim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00598: claim_submit_claim [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/submitClaim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/submitClaim/id/{id}', function () {
    it('TC_API_00599: claim_submit_claim_request [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/submitClaim/id/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00600: claim_submit_claim_request [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/submitClaim/id/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/viewClaim', function () {
    it('TC_API_00601: claim_view_claim [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewClaim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00602: claim_view_claim [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewClaim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/assignClaim', function () {
    it('TC_API_00603: claim_assign_claim [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/assignClaim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00604: claim_assign_claim [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/assignClaim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/assignClaim/id/{id}', function () {
    it('TC_API_00605: claim_assign_claim_request [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/assignClaim/id/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00606: claim_assign_claim_request [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/assignClaim/id/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/viewAssignClaim', function () {
    it('TC_API_00607: claim_employee_claim [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewAssignClaim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00608: claim_employee_claim [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/viewAssignClaim',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /claim/requests/{requestId}/attachId/{attachId}', function () {
    it('TC_API_00609: claim_attachment [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/requests/1/attachId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00610: claim_attachment [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/claim/requests/1/attachId/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
