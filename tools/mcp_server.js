#!/usr/bin/env node
/**
 * Model Context Protocol (MCP) Server for Quality Knowledge Graph (QKG v2.2)
 *
 * Implements standard stdio JSON-RPC 2.0 MCP protocol.
 * Consumed by: Cursor, Antigravity, GitHub Copilot, Windsurf.
 *
 * Exposes:
 *   - Suite A: Context Retrieval (Workflows, Business Rules, AST Contracts, API/UI, Tests, Fixtures)
 *   - Suite B: Test Artifact Governance (Propose, Review Queue, Approval)
 *   - Suite C: Quality Intelligence (Code Impact, TIA, Gaps, Test Health, Release Readiness)
 *
 * Security Policy:
 *   - Dispatches through shared QeIntelligenceService and TestArtifactGovernanceService.
 *   - Zero direct unrestricted Neo4j/MariaDB mutations via MCP.
 *   - Diagnostic logs written to stderr; stdout strictly reserved for JSON-RPC.
 */

const readline = require('readline');
const qeIntelligenceService = require('./qe_app/services/qe_intelligence_service');
const artifactGovernanceService = require('./qe_app/services/artifact_governance_service');

const SERVER_NAME = 'qkg-intelligence-mcp';
const SERVER_VERSION = '2.2.0';

const MCP_TOOLS = [
  // --- Suite A: Context Retrieval for Test Generation ---
  {
    name: 'get_test_generation_context',
    description: 'Retrieve consolidated graph slice (workflow, statutory rules, code contracts, API routes, DB entities, existing tests, synthetic fixture recommendations) for authoring traceable tests.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: { type: 'string', description: 'Business workflow identifier (e.g. WF_PAYROLL_RUN, WF_PAYROLL_CONFIG)' },
        feature_id: { type: 'string', description: 'Feature identifier (e.g. FEAT_PAY_ENGINE)' },
        include_existing_tests: { type: 'boolean', description: 'Whether to include mapped tests for deduplication', default: true }
      },
      required: ['workflow_id']
    }
  },
  {
    name: 'get_business_context',
    description: 'Retrieve business workflows, statutory rules, requirements, and user personas from the knowledge graph.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: { type: 'string', description: 'Workflow identifier' },
        rule_id: { type: 'string', description: 'Business rule identifier (e.g. BR_PAY_009)' },
        feature_id: { type: 'string', description: 'Feature identifier' }
      }
    }
  },
  {
    name: 'get_code_context',
    description: 'Retrieve PHP/Vue AST implementation details, method signatures, call hierarchies, accessed DB columns, and route bindings.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: { type: 'string', description: 'Source file path or substring' },
        method_id: { type: 'string', description: 'Canonical method identifier' },
        class_name: { type: 'string', description: 'FQCN or class name' }
      }
    }
  },
  {
    name: 'get_api_ui_context',
    description: 'Retrieve API endpoint contracts, HTTP methods, payload schemas, and mapped Vue 3 UI pages/components.',
    inputSchema: {
      type: 'object',
      properties: {
        endpoint_id: { type: 'string', description: 'Endpoint identifier' },
        route: { type: 'string', description: 'URL route pattern substring' },
        page_id: { type: 'string', description: 'UI Page identifier' }
      }
    }
  },
  {
    name: 'get_existing_tests',
    description: 'Retrieve existing PHPUnit, Jest, and Playwright tests mapped to a workflow, rule, method, or endpoint to prevent duplication.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: { type: 'string' },
        rule_id: { type: 'string' },
        method_id: { type: 'string' },
        endpoint_id: { type: 'string' }
      }
    }
  },

  // --- Suite B: Test Artifact Governance (Proposed -> Approved) ---
  {
    name: 'propose_test_artifact',
    description: 'Submit an AI-generated candidate test scenario into the Staging Review Queue with deduplication and traceability evidence.',
    inputSchema: {
      type: 'object',
      properties: {
        workflow_id: { type: 'string', description: 'Target workflow ID' },
        feature_id: { type: 'string', description: 'Target feature ID' },
        rule_id: { type: 'string', description: 'Primary statutory or business rule ID' },
        scenario_title: { type: 'string', description: 'Short descriptive scenario title' },
        test_tier: { type: 'string', enum: ['UNIT', 'API', 'E2E_PLAYWRIGHT', 'E2E_CYPRESS'], default: 'E2E_PLAYWRIGHT' },
        action_flow: { type: 'string', description: 'Step-by-step test execution flow' },
        assertions: { type: 'array', items: { type: 'string' }, description: 'List of expected business assertions' },
        synthetic_data_fixture: { type: 'string', description: 'Factory fixture reference (zero production PII)' },
        traceability_evidence: {
          type: 'object',
          properties: {
            mapped_methods: { type: 'array', items: { type: 'string' } },
            mapped_endpoints: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      required: ['workflow_id', 'scenario_title', 'assertions']
    }
  },
  {
    name: 'list_review_queue',
    description: 'List AI-generated test scenarios in the Review Queue pending QA Lead validation.',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['PROPOSED', 'IN_REVIEW', 'APPROVED', 'IMPLEMENTED', 'ACTIVE', 'REJECTED'] },
        workflow_id: { type: 'string' },
        limit: { type: 'integer', default: 20 },
        offset: { type: 'integer', default: 0 }
      }
    }
  },
  {
    name: 'get_test_artifact',
    description: 'Retrieve details and review history of a specific test artifact.',
    inputSchema: {
      type: 'object',
      properties: {
        artifact_id: { type: 'string', description: 'Artifact identifier (e.g. PROP-PAYROLL_RUN-...) ' }
      },
      required: ['artifact_id']
    }
  },
  {
    name: 'update_artifact_status',
    description: 'Update the lifecycle status of a test artifact (e.g. approve for Playwright script generation).',
    inputSchema: {
      type: 'object',
      properties: {
        artifact_id: { type: 'string', description: 'Artifact identifier' },
        status: { type: 'string', enum: ['IN_REVIEW', 'APPROVED', 'IMPLEMENTED', 'ACTIVE', 'DEPRECATED', 'REJECTED'] },
        actor: { type: 'string', default: 'QA_LEAD' },
        comment: { type: 'string' }
      },
      required: ['artifact_id', 'status']
    }
  },

  // --- Suite C: Quality Intelligence & Impact ---
  {
    name: 'get_code_impact',
    description: 'Analyze direct and transitive code impact across call graphs for a list of modified files.',
    inputSchema: {
      type: 'object',
      properties: {
        changed_files: { type: 'array', items: { type: 'string' }, description: 'Array of repository relative file paths' }
      },
      required: ['changed_files']
    }
  },
  {
    name: 'get_business_impact',
    description: 'Identify user workflows, business features, and persona operations affected by changed files.',
    inputSchema: {
      type: 'object',
      properties: {
        changed_files: { type: 'array', items: { type: 'string' } }
      },
      required: ['changed_files']
    }
  },
  {
    name: 'get_impacted_tests',
    description: 'Run Test Impact Analysis (TIA) to select and rank regression tests impacted by code changes.',
    inputSchema: {
      type: 'object',
      properties: {
        changed_files: { type: 'array', items: { type: 'string' } }
      },
      required: ['changed_files']
    }
  },
  {
    name: 'explain_test_selection',
    description: 'Explain why a test was selected or excluded by returning the exact Cypher dependency path.',
    inputSchema: {
      type: 'object',
      properties: {
        test_id: { type: 'string' },
        changed_files: { type: 'array', items: { type: 'string' } }
      },
      required: ['test_id']
    }
  },
  {
    name: 'get_coverage_gaps',
    description: 'Identify untested code paths, orphan endpoints, and unverified business rules.',
    inputSchema: {
      type: 'object',
      properties: {
        plugin: { type: 'string' },
        scope: { type: 'string' }
      }
    }
  },
  {
    name: 'get_test_health',
    description: 'Retrieve flakiness telemetry, execution duration, and historical pass rates for test suites.',
    inputSchema: {
      type: 'object',
      properties: {
        suite_id: { type: 'string' },
        test_id: { type: 'string' }
      }
    }
  },
  {
    name: 'get_module_quality',
    description: 'Retrieve comprehensive quality metrics for an OrangeHRM module or plugin.',
    inputSchema: {
      type: 'object',
      properties: {
        plugin: { type: 'string', description: 'e.g. orangehrmPayrollPlugin, orangehrmPimPlugin' }
      },
      required: ['plugin']
    }
  },
  {
    name: 'compare_snapshots',
    description: 'Compare two graph snapshots to detect structural changes and quality regressions.',
    inputSchema: {
      type: 'object',
      properties: {
        base_snapshot: { type: 'string' },
        target_snapshot: { type: 'string' }
      }
    }
  },
  {
    name: 'get_release_readiness',
    description: 'Evaluate overall release readiness, risk score, coverage on changed surfaces, and blocking issues.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

class McpServer {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
  }

  start() {
    this.rl.on('line', async (line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        const request = JSON.parse(trimmed);
        const response = await this.handleMessage(request);
        if (response) {
          process.stdout.write(JSON.stringify(response) + '\n');
        }
      } catch (err) {
        process.stderr.write(`[MCP Error] Failed to parse message: ${err.message}\n`);
      }
    });

    process.stderr.write(`[MCP Server] ${SERVER_NAME} v${SERVER_VERSION} started on stdio\n`);
  }

  close() {
    if (this.rl) {
      this.rl.close();
    }
  }

  async handleMessage(request) {
    const { id, method, params } = request;

    // Handle notifications (no response required)
    if (id === undefined || id === null) {
      if (method === 'notifications/initialized') {
        process.stderr.write('[MCP Server] Client acknowledged initialization\n');
      }
      return null;
    }

    try {
      switch (method) {
        case 'initialize':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              serverInfo: {
                name: SERVER_NAME,
                version: SERVER_VERSION
              },
              capabilities: {
                tools: {}
              }
            }
          };

        case 'ping':
          return { jsonrpc: '2.0', id, result: {} };

        case 'tools/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              tools: MCP_TOOLS
            }
          };

        case 'tools/call': {
          const toolName = params?.name;
          const args = params?.arguments || {};
          const result = await this.executeTool(toolName, args);
          return {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            }
          };
        }

        default:
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: -32601,
              message: `Method '${method}' not found`
            }
          };
      }
    } catch (err) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32000,
          message: err.message || 'Internal MCP execution error'
        }
      };
    }
  }

  async executeTool(name, args) {
    process.stderr.write(`[MCP Tool Call] ${name} (${JSON.stringify(args)})\n`);

    switch (name) {
      // Suite A: Context Retrieval
      case 'get_test_generation_context':
        return await qeIntelligenceService.getTestGenerationContext(args);
      case 'get_business_context':
        return await qeIntelligenceService.getBusinessContext(args);
      case 'get_code_context':
        return await qeIntelligenceService.getCodeContext(args);
      case 'get_api_ui_context':
        return await qeIntelligenceService.getApiUiContext(args);
      case 'get_existing_tests':
        return await qeIntelligenceService.getExistingTests(args);

      // Suite B: Artifact Governance
      case 'propose_test_artifact':
        return await artifactGovernanceService.proposeArtifact(args);
      case 'list_review_queue':
        return await artifactGovernanceService.listReviewQueue(args);
      case 'get_test_artifact':
        return await artifactGovernanceService.getArtifact(args.artifact_id);
      case 'update_artifact_status':
        return await artifactGovernanceService.updateArtifactStatus(args.artifact_id, args.status, {
          actor: args.actor,
          comment: args.comment
        });

      // Suite C: Quality Intelligence
      case 'get_code_impact':
        return await qeIntelligenceService.getCodeImpact(args);
      case 'get_business_impact':
        return await qeIntelligenceService.getBusinessImpact(args);
      case 'get_impacted_tests':
        return await qeIntelligenceService.getImpactedTests(args);
      case 'explain_test_selection':
        return await qeIntelligenceService.explainTestSelection(args);
      case 'get_coverage_gaps':
        return await qeIntelligenceService.getCoverageGaps(args);
      case 'get_test_health':
        return await qeIntelligenceService.getTestHealth(args);
      case 'get_module_quality':
        return await qeIntelligenceService.getModuleQuality(args);
      case 'compare_snapshots':
        return await qeIntelligenceService.compareSnapshots(args);
      case 'get_release_readiness':
        return await qeIntelligenceService.getReleaseReadiness();

      default:
        throw new Error(`Unknown tool '${name}'`);
    }
  }
}

if (require.main === module) {
  const server = new McpServer();
  server.start();
}

module.exports = { McpServer, MCP_TOOLS };
