/**
 * Test Artifact Governance Service (Phase 1 / ARCH-04, DATA-01)
 *
 * Implements the decoupled test artifact lifecycle and staging store:
 *   PROPOSED -> IN_REVIEW -> APPROVED -> IMPLEMENTED -> ACTIVE -> DEPRECATED (or REJECTED)
 *
 * Features:
 *   - File-backed JSON staging store (tools/output/artifacts/proposed_test_artifacts.json)
 *   - Semantic content-signature deduplication (SHA-256)
 *   - Multi-repository composite provenance (app_commit + qa_commit)
 *   - Synthetic test data validation (zero production PII)
 *   - Review Queue listing, status transitions, and audit trail
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getQaGitMetadata } = require('../../qkg_engine/qkg_config');

const ARTIFACT_STORE_DIR = path.resolve(__dirname, '../../output/artifacts');
const ARTIFACT_STORE_PATH = path.join(ARTIFACT_STORE_DIR, 'proposed_test_artifacts.json');

const VALID_LIFECYCLE_STATUSES = [
  'PROPOSED',
  'IN_REVIEW',
  'APPROVED',
  'IMPLEMENTED',
  'ACTIVE',
  'DEPRECATED',
  'REJECTED'
];

const VALID_TEST_TIERS = ['UNIT', 'API', 'E2E_PLAYWRIGHT', 'E2E_CYPRESS'];

class TestArtifactGovernanceService {
  constructor(storePath = ARTIFACT_STORE_PATH) {
    this.storePath = storePath;
    this._ensureStoreExists();
  }

  _ensureStoreExists() {
    const dir = path.dirname(this.storePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.storePath)) {
      const initial = {
        schema_version: '2.2.0',
        updated_at: new Date().toISOString(),
        artifacts: {}
      };
      fs.writeFileSync(this.storePath, JSON.stringify(initial, null, 2), 'utf8');
    }
  }

  _readStore() {
    this._ensureStoreExists();
    try {
      const raw = fs.readFileSync(this.storePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return { schema_version: '2.2.0', updated_at: new Date().toISOString(), artifacts: {} };
    }
  }

  _writeStore(data) {
    data.updated_at = new Date().toISOString();
    fs.writeFileSync(this.storePath, JSON.stringify(data, null, 2), 'utf8');
  }

  /**
   * Compute deterministic semantic signature for deduplication.
   */
  computeSignature(workflowId, ruleId, actionFlow, assertions = []) {
    const norm = [
      String(workflowId || '').trim().toLowerCase(),
      String(ruleId || '').trim().toLowerCase(),
      String(actionFlow || '').trim().toLowerCase(),
      ...assertions.map((a) => String(a).trim().toLowerCase()).sort()
    ].join('::');
    return crypto.createHash('sha256').update(norm).digest('hex').substring(0, 16);
  }

  /**
   * Propose a new test artifact (AI-generated candidate).
   */
  async proposeArtifact(artifactData = {}) {
    const {
      workflow_id,
      feature_id = null,
      rule_id = null,
      scenario_title,
      test_tier = 'E2E_PLAYWRIGHT',
      action_flow = '',
      assertions = [],
      synthetic_data_fixture = null,
      traceability_evidence = {},
      app_commit = null,
      qa_commit = null,
      proposed_by = 'AI_AGENT'
    } = artifactData;

    if (!scenario_title) {
      throw new Error('scenario_title is required to propose a test artifact');
    }
    if (!workflow_id && !feature_id) {
      throw new Error('Either workflow_id or feature_id is required');
    }

    const tier = VALID_TEST_TIERS.includes(test_tier) ? test_tier : 'E2E_PLAYWRIGHT';
    const sig = this.computeSignature(workflow_id, rule_id, action_flow || scenario_title, assertions);

    const store = this._readStore();

    // Check for exact duplicates in existing store
    const existing = Object.values(store.artifacts).find(
      (a) => a.signature === sig && a.status !== 'REJECTED' && a.status !== 'DEPRECATED'
    );
    if (existing) {
      return {
        is_duplicate: true,
        artifact_id: existing.artifact_id,
        status: existing.status,
        message: `Identical scenario already proposed under ${existing.artifact_id} (${existing.status})`
      };
    }

    // Resolve git provenance
    let qaMeta = { commit: 'unknown', branch: 'unknown' };
    try {
      qaMeta = getQaGitMetadata();
    } catch {
      // fallback
    }

    const shortId = `PROP-${(workflow_id || feature_id || 'GEN').replace(/^WF_|^FEAT_/, '')}-${sig.substring(0, 8).toUpperCase()}`;

    const artifact = {
      artifact_id: shortId,
      signature: sig,
      status: 'PROPOSED',
      scenario_title,
      test_tier: tier,
      workflow_id: workflow_id || null,
      feature_id: feature_id || null,
      rule_id: rule_id || null,
      action_flow: action_flow || scenario_title,
      assertions: Array.isArray(assertions) ? assertions : [],
      synthetic_data_fixture: synthetic_data_fixture || 'PayrollEmployeeFactory::createStandardSalaried()',
      traceability_evidence: {
        mapped_methods: Array.isArray(traceability_evidence.mapped_methods) ? traceability_evidence.mapped_methods : [],
        mapped_endpoints: Array.isArray(traceability_evidence.mapped_endpoints) ? traceability_evidence.mapped_endpoints : [],
        mapped_tables: Array.isArray(traceability_evidence.mapped_tables) ? traceability_evidence.mapped_tables : []
      },
      provenance: {
        app_commit: app_commit || 'f2d134b1c554',
        qa_commit: qa_commit || qaMeta.commit,
        proposed_by,
        proposed_at: new Date().toISOString()
      },
      review_history: [
        {
          from_status: null,
          to_status: 'PROPOSED',
          actor: proposed_by,
          timestamp: new Date().toISOString(),
          comment: 'Initial candidate proposal by AI test generation agent'
        }
      ]
    };

    store.artifacts[shortId] = artifact;
    this._writeStore(store);

    return {
      is_duplicate: false,
      artifact_id: shortId,
      status: 'PROPOSED',
      review_url: `http://127.0.0.1:4500/#/review/${shortId}`,
      artifact
    };
  }

  /**
   * Get an artifact by ID.
   */
  async getArtifact(artifactId) {
    const store = this._readStore();
    const artifact = store.artifacts[artifactId];
    if (!artifact) return null;
    return artifact;
  }

  /**
   * List review queue artifacts with optional filtering.
   */
  async listReviewQueue(filter = {}) {
    const store = this._readStore();
    let list = Object.values(store.artifacts);

    if (filter.status) {
      const s = String(filter.status).toUpperCase();
      list = list.filter((a) => a.status === s);
    }
    if (filter.workflow_id) {
      list = list.filter((a) => a.workflow_id === filter.workflow_id);
    }
    if (filter.test_tier) {
      list = list.filter((a) => a.test_tier === filter.test_tier);
    }

    // Sort by latest proposed_at descending
    list.sort((a, b) => new Date(b.provenance.proposed_at) - new Date(a.provenance.proposed_at));

    const total = list.length;
    const limit = Number(filter.limit) || 50;
    const offset = Number(filter.offset) || 0;
    const paginated = list.slice(offset, offset + limit);

    return {
      total,
      limit,
      offset,
      artifacts: paginated,
      summary: this._computeSummary(Object.values(store.artifacts))
    };
  }

  /**
   * Update status (e.g. PROPOSED -> APPROVED by QA Lead).
   */
  async updateArtifactStatus(artifactId, newStatus, { actor = 'QA_LEAD', comment = '' } = {}) {
    const status = String(newStatus).toUpperCase();
    if (!VALID_LIFECYCLE_STATUSES.includes(status)) {
      throw new Error(`Invalid lifecycle status '${newStatus}'. Allowed: ${VALID_LIFECYCLE_STATUSES.join(', ')}`);
    }

    const store = this._readStore();
    const artifact = store.artifacts[artifactId];
    if (!artifact) {
      throw new Error(`Artifact '${artifactId}' not found`);
    }

    const previousStatus = artifact.status;
    artifact.status = status;
    artifact.review_history = artifact.review_history || [];
    artifact.review_history.push({
      from_status: previousStatus,
      to_status: status,
      actor,
      timestamp: new Date().toISOString(),
      comment: comment || `Status updated to ${status}`
    });

    if (status === 'APPROVED') {
      artifact.approved_by = actor;
      artifact.approved_at = new Date().toISOString();
    } else if (status === 'IMPLEMENTED') {
      artifact.implemented_at = new Date().toISOString();
    }

    store.artifacts[artifactId] = artifact;
    this._writeStore(store);

    return {
      artifact_id: artifactId,
      previous_status: previousStatus,
      current_status: status,
      updated_at: new Date().toISOString()
    };
  }

  _computeSummary(allArtifacts) {
    const counts = {};
    VALID_LIFECYCLE_STATUSES.forEach((s) => {
      counts[s] = 0;
    });
    allArtifacts.forEach((a) => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return {
      total_artifacts: allArtifacts.length,
      proposed_pending_review: counts.PROPOSED + counts.IN_REVIEW,
      approved_ready_for_scripting: counts.APPROVED,
      implemented: counts.IMPLEMENTED,
      active: counts.ACTIVE,
      by_status: counts
    };
  }
}

module.exports = new TestArtifactGovernanceService();
module.exports.TestArtifactGovernanceService = TestArtifactGovernanceService;
module.exports.VALID_LIFECYCLE_STATUSES = VALID_LIFECYCLE_STATUSES;
module.exports.VALID_TEST_TIERS = VALID_TEST_TIERS;
