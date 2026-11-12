const neo4jService = require('./neo4j_service');
const githubService = require('./github_service');
const { TIAEngine, computeRiskScore } = require('../../qkg_engine/tia_engine');

class TIAService {
  constructor() {
    this.engine = new TIAEngine((cypher, params) => neo4jService.runQuery(cypher, params));
  }

  calculateRiskScore(metrics) {
    return computeRiskScore(metrics);
  }

  async analyzePullRequest(prNumber = 12, options = {}) {
    const prDetails = githubService.getPullRequestDetails(prNumber, options);
    const files = prDetails.changedFiles || [];
    return await this.analyzeFiles(files, {
      ...prDetails,
      ...options
    });
  }

  async analyzeFiles(files = [], context = {}) {
    return await this.engine.analyzeFiles(files, context);
  }

  async analyzeChangedFiles(files = [], context = {}) {
    return await this.analyzeFiles(files, context);
  }

  async analyzeCrossPluginImpact(plugin, options = {}) {
    return await this.engine.analyzeCrossPluginImpact(plugin, options);
  }
}

module.exports = new TIAService();
module.exports.TIAService = TIAService;
