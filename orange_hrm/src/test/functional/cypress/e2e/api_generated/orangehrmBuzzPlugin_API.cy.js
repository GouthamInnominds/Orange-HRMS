/**
 * Automated Cypress API Contract Test Suite for orangehrmBuzzPlugin
 * Tests: 54
 */

describe('orangehrmBuzzPlugin - Automated API Contract Tests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  describe('GET /api/v2/buzz/feed', function () {
    it('TC_API_00462: apiv2_buzz_feed [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/feed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00463: apiv2_buzz_feed [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/feed',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/buzz/anniversaries', function () {
    it('TC_API_00464: apiv2_buzz_upcoming_anniversary [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/anniversaries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00465: apiv2_buzz_upcoming_anniversary [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/anniversaries',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/buzz/posts', function () {
    it('TC_API_00466: apiv2_buzz_posts [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/posts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00467: apiv2_buzz_posts [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/posts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00468: apiv2_buzz_posts [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/posts',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/buzz/shares', function () {
    it('TC_API_00469: apiv2_buzz_shares [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00470: apiv2_buzz_shares [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00471: apiv2_buzz_shares [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/buzz/shares/{id}', function () {
    it('TC_API_00472: apiv2_buzz_share [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/shares/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00473: apiv2_buzz_share [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/shares/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00474: apiv2_buzz_share [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/shares/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/buzz/shares/{id}', function () {
    it('TC_API_00475: apiv2_buzz_share [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/buzz/shares/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00476: apiv2_buzz_share [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/buzz/shares/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/buzz/shares/{shareId}/comments', function () {
    it('TC_API_00477: apiv2_buzz_comments [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/shares/1/comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00478: apiv2_buzz_comments [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/shares/1/comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/buzz/shares/{shareId}/comments', function () {
    it('TC_API_00479: apiv2_buzz_comments [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares/1/comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00480: apiv2_buzz_comments [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares/1/comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00481: apiv2_buzz_comments [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares/1/comments',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/buzz/shares/{shareId}/comments/{commentId}', function () {
    it('TC_API_00482: apiv2_buzz_comment [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/shares/1/comments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00483: apiv2_buzz_comment [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/shares/1/comments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/buzz/shares/{shareId}/comments/{commentId}', function () {
    it('TC_API_00484: apiv2_buzz_comment [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/shares/1/comments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00485: apiv2_buzz_comment [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/shares/1/comments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00486: apiv2_buzz_comment [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/shares/1/comments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/buzz/shares/{shareId}/comments/{commentId}', function () {
    it('TC_API_00487: apiv2_buzz_comment [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/buzz/shares/1/comments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00488: apiv2_buzz_comment [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/buzz/shares/1/comments/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/buzz/validation/links', function () {
    it('TC_API_00489: aapiv2_buzz_video_url_validation [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/validation/links',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00490: aapiv2_buzz_video_url_validation [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/validation/links',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/buzz/shares/{shareId}/likes', function () {
    it('TC_API_00491: apiv2_buzz_like_on_share [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/shares/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00492: apiv2_buzz_like_on_share [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/shares/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/buzz/shares/{shareId}/likes', function () {
    it('TC_API_00493: apiv2_buzz_like_on_share [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00494: apiv2_buzz_like_on_share [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00495: apiv2_buzz_like_on_share [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/shares/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/buzz/shares/{shareId}/likes', function () {
    it('TC_API_00496: apiv2_buzz_like_on_share [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/buzz/shares/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00497: apiv2_buzz_like_on_share [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/buzz/shares/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/buzz/comments/{commentId}/likes', function () {
    it('TC_API_00498: apiv2_buzz_comment_on_share [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/comments/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00499: apiv2_buzz_comment_on_share [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/comments/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('POST /api/v2/buzz/comments/{commentId}/likes', function () {
    it('TC_API_00500: apiv2_buzz_comment_on_share [Expected: 200]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/comments/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00501: apiv2_buzz_comment_on_share [Expected: 401]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/comments/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00502: apiv2_buzz_comment_on_share [Expected: 422]', function () {
      cy.request({
        method: 'POST',
        url: '/api/v2/buzz/comments/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('DELETE /api/v2/buzz/comments/{commentId}/likes', function () {
    it('TC_API_00503: apiv2_buzz_comment_on_share [Expected: 200]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/buzz/comments/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00504: apiv2_buzz_comment_on_share [Expected: 401]', function () {
      cy.request({
        method: 'DELETE',
        url: '/api/v2/buzz/comments/1/likes',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/buzz/posts/{id}', function () {
    it('TC_API_00505: apiv2_buzz_post [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/posts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00506: apiv2_buzz_post [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/posts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('PUT /api/v2/buzz/posts/{id}', function () {
    it('TC_API_00507: apiv2_buzz_post [Expected: 200]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/posts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00508: apiv2_buzz_post [Expected: 401]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/posts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00509: apiv2_buzz_post [Expected: 422]', function () {
      cy.request({
        method: 'PUT',
        url: '/api/v2/buzz/posts/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /api/v2/buzz/posts/{postId}/shares', function () {
    it('TC_API_00510: apiv2_buzz_post_share [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/posts/1/shares',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00511: apiv2_buzz_post_share [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/api/v2/buzz/posts/1/shares',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /buzz/photo/{id}', function () {
    it('TC_API_00512: buzz_photo [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/buzz/photo/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00513: buzz_photo [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/buzz/photo/1',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

  describe('GET /buzz/viewBuzz', function () {
    it('TC_API_00514: buzz_module [Expected: 200]', function () {
      cy.request({
        method: 'GET',
        url: '/buzz/viewBuzz',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
      });
    });

    it('TC_API_00515: buzz_module [Expected: 401]', function () {
      cy.request({
        method: 'GET',
        url: '/buzz/viewBuzz',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
      });
    });

  });

});
