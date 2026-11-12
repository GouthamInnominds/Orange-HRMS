const { execFileSync } = require('child_process');
const path = require('path');

class GitHubService {
  constructor() {
    this.repoPath = path.resolve(__dirname, '../../../');
  }

  runGitArgs(args) {
    try {
      return execFileSync('git', args, {
        cwd: this.repoPath,
        encoding: 'utf8',
        timeout: 8000
      }).trim();
    } catch (_) {
      return null;
    }
  }

  getRepositoryStatus() {
    const branch = this.runGitArgs(['branch', '--show-current']) || 'unknown';
    const headCommit = this.runGitArgs(['rev-parse', 'HEAD']);
    const lastCommit = this.runGitArgs(['log', '-1', '--pretty=format:%h - %an, %ar : %s']) || 'unavailable';
    const status = this.runGitArgs(['status', '-s']) || '';
    const remotes = this.runGitArgs(['remote', '-v']) || '';

    return {
      repository: 'GouthamInnominds/Orange-HRMS',
      branch,
      headCommit,
      lastCommit,
      hasUncommittedChanges: status.length > 0,
      remotes: remotes.split('\n')[0] || 'origin'
    };
  }

  getRecentCommits(limit = 10) {
    const safeLimit = Math.max(1, Math.min(50, parseInt(limit, 10) || 10));
    const logs = this.runGitArgs(['log', `-${safeLimit}`, '--pretty=format:%h|%an|%ad|%s', '--date=short']);
    if (!logs) return [];

    return logs.split('\n').filter(Boolean).map((line) => {
      const [hash, author, date, ...msgParts] = line.split('|');
      return { hash, author, date, message: msgParts.join('|') };
    });
  }

  getDiffChangedFiles(baseRef = null, headRef = 'HEAD') {
    const changed = new Set();

    if (baseRef) {
      const out = this.runGitArgs(['diff', '--name-only', `${baseRef}...${headRef}`]) ||
                  this.runGitArgs(['diff', '--name-only', baseRef, headRef]);
      if (out) {
        out.split('\n').map((l) => l.trim()).filter(Boolean).forEach((f) => changed.add(f));
      }
    } else {
      // Check uncommitted working tree changes first; otherwise inspect recent feature commit(s)
      const porcelain = this.runGitArgs(['status', '--porcelain']);
      if (porcelain) {
        for (const line of porcelain.split('\n').filter(Boolean)) {
          const p = line.slice(3).trim();
          if (p) changed.add(p.includes(' -> ') ? p.split(' -> ').pop().trim() : p);
        }
      }
      if (changed.size === 0) {
        const lastDiff = this.runGitArgs(['diff', '--name-only', 'HEAD~1', 'HEAD']);
        if (lastDiff) {
          lastDiff.split('\n').map((l) => l.trim()).filter(Boolean).forEach((f) => changed.add(f));
        }
      }
    }

    return Array.from(changed);
  }

  listPullRequests() {
    const branch = this.runGitArgs(['branch', '--show-current']) || 'v2-main';
    const payrollCommitDiff = this.runGitArgs(['diff', '--name-only', '7d69e27~1', '7d69e27']);
    const headDiff = this.runGitArgs(['diff', '--name-only', 'HEAD~1', 'HEAD']);
    const pr12Files = payrollCommitDiff
      ? payrollCommitDiff.split('\n').filter(Boolean)
      : (headDiff ? headDiff.split('\n').filter(Boolean) : []);

    return [
      {
        id: 12,
        title: 'India Payroll Extension v2.2 & Cross-Module Integration',
        branch,
        base: 'v2-main',
        baseRef: '7d69e27~1',
        headRef: '7d69e27',
        author: 'QE-Architect',
        state: 'MERGED',
        labels: ['india-payroll-v2.2', 'cross-module'],
        changedFilesCount: pr12Files.length,
        createdAt: '2026-11-11'
      },
      {
        id: 11,
        title: 'Latest Working / HEAD Commit Diff',
        branch,
        base: 'HEAD~1',
        baseRef: 'HEAD~1',
        headRef: 'HEAD',
        author: 'Workspace',
        state: 'OPEN',
        labels: ['tia-live-diff'],
        changedFilesCount: headDiff ? headDiff.split('\n').filter(Boolean).length : 0,
        createdAt: new Date().toISOString().slice(0, 10)
      }
    ];
  }

  getPullRequestDetails(prId, options = {}) {
    const prs = this.listPullRequests();
    const pr = prs.find((p) => p.id === parseInt(prId, 10)) || prs[0];

    const baseRef = options.baseRef || pr.baseRef || 'HEAD~1';
    const headRef = options.headRef || pr.headRef || 'HEAD';
    const changedFiles = this.getDiffChangedFiles(baseRef, headRef);
    const diffStat = this.runGitArgs(['diff', '--stat', baseRef, headRef]) || `${changedFiles.length} changed files`;

    return {
      ...pr,
      baseRef,
      headRef,
      changedFilesCount: changedFiles.length,
      diffSummary: diffStat,
      changedFiles
    };
  }

  getFileDiff(filePath, baseRef = 'HEAD~1', headRef = 'HEAD') {
    const cleanPath = String(filePath || '').replace(/\0/g, '');
    const diff = this.runGitArgs(['diff', baseRef, headRef, '--', cleanPath]);
    return {
      filePath: cleanPath,
      diff: diff || 'No diff hunks between specified revisions.'
    };
  }
}

module.exports = new GitHubService();
module.exports.GitHubService = GitHubService;
