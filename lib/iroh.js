
import { tmpdir } from "node:os";
import process from "node:process";
import { join } from "node:path";
import { mkdtemp } from "node:fs/promises";
import { spawn } from "node:child_process";
import { execa } from 'execa';

// Interface with Iroh through its console (because I'm a maniac).

// This sets up a tmpdir and manages IROH_DATA_DIR.
export class IrohNode {
  constructor () {
    this.started = false;
    this.process = null;
    this.dataDir = null;
  }
  checkStarted () {
    if (!this.started) throw new Error(`Iroh node must be started first.`);
  }
  // this actually returns the full options object that contains env
  env () {
    return { env: {
      IROH_DATA_DIR: this.dataDir,
      PATH: process.env.PATH,
    }};
  }
  async command (cmd, prms) {
    this.checkStarted();
    return await execa(cmd, prms, this.env());
  }
  async start (dataDir) {
    if (this.started) return;
    this.dataDir = dataDir || await mkdtemp(join(tmpdir(), 'iroh-'));
    console.warn(`dir ${this.dataDir}`);
    return new Promise((resolve) => {
      this.process = spawn('iroh', ['start'], this.env());
      this.process.on('close', (code) => {
        console.warn(`Iroh node shut down with code ${code}`);
        this.started = false;
        this.process = null;
      });
      this.process.stdout.on('data', (data) => console.log(`OUT: ${data}`));
      this.process.stderr.on('data', (data) => {
        if (this.started) return;
        const match = /^Iroh is running\nNode ID:\s+(\w+)/.exec(data);
        if (match && match[1]) {
          this.nodeID = match[1];
          this.started = true;
          resolve();
        }
      });
    });
  }
  async shutdown (force) {
    const sht = await this.command('iroh', ['node', 'shutdown', force ? '--force' : false].filter(Boolean));
    console.warn(sht);
    this.process = null;
    this.started = false;
  }
}

// XXX
// It's not obvous that working via the CLI works well, I can't seem to get it to even just
// shut down and connect correctly using the CLI directly.
// INSTEAD
// Inside dataDir, if the node is running, is a rpc.lock. It contains a 16 that's a number
// for the port. The default is 1337.
// That endpoint is QUIC RPC as in https://github.com/n0-computer/iroh/blob/main/iroh/src/rpc_protocol.rs
