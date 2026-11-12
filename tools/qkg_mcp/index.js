#!/usr/bin/env node
const readline = require('readline');
const path = require('path');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch (_) {}

const { QkgMcpServer } = require('./server_core');

const server = new QkgMcpServer();
const rl = readline.createInterface({ input: process.stdin, terminal: false });

let queue = Promise.resolve();

rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  queue = queue.then(async () => {
    try {
      const req = JSON.parse(trimmed);
      const res = await server.handleJsonRpc(req);
      if (res) {
        process.stdout.write(JSON.stringify(res) + '\n');
      }
    } catch (err) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: { code: -32700, message: `Parse error: ${err.message}` }
        }) + '\n'
      );
    }
  });
});

rl.on('close', () => {
  queue.finally(async () => {
    await server.close();
    process.exit(0);
  });
});
