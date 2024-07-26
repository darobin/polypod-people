
import { tmpdir } from "node:os";
import { env } from "node:process";
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
      PATH: env.PATH,
    }};
  }
  async command (cmd, prms) {
    this.checkStarted();
    return execa(cmd, prms, this.env());
  }
  async start (dataDir) {
    if (this.started) return;
    this.dataDir = dataDir || await mkdtemp(join(tmpdir(), 'iroh-'));
    // console.warn(`dir ${this.dataDir}`);
    return new Promise((resolve) => {
      this.process = spawn('iroh', ['start'], this.env());
      this.process.on('close', (code) => {
        if (code !== 0) console.warn(`Iroh node shut down with code ${code}`);
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
  // this isn't the built-in way to do it, use with caution
  stop () {
    if (!this.started) return;
    this.process.kill('SIGINT');
    this.process = null;
    this.started = false;
  }
  // XXX had trouble getting this to work
  // async shutdown (force) {
  //   const sht = await this.command('iroh', ['node', 'shutdown', force ? '--force' : false].filter(Boolean));
  //   console.warn(sht);
  //   this.process = null;
  //   this.started = false;
  // }
  async listAuthors () {
    const { stdout } = await this.command('iroh', ['authors', 'list']);
    if (!stdout) return [];
    return stdout.split('\n').map(au => new IrohAuthor(au));
  }
  async defaultAuthor () {
    const { stdout } = await this.command('iroh', ['authors', 'default']);
    if (!stdout) return;
    return new IrohAuthor(stdout);
  }
  async createAuthor () {
    const { stdout } = await this.command('iroh', ['authors', 'create']);
    if (!stdout) throw new Error('Failed to create author');
    return new IrohAuthor(stdout);
  }
  async deleteAuthor (id) {
    try {
      const { exitCode } = await this.command('iroh', ['authors', 'delete', id]);
      if (exitCode === 0) return true;
    }
    catch (err) {
      throw new Error('Failed to delete author');
    }
  }
}

class IrohAuthor {
  constructor (id) {
    this.id = id;
  }
}


/*
- [x] start    
- [ ] docs     
  - [ ] create
  - [ ] join
  - [ ] list
  - [ ] share
  - [ ] set
  - [ ] dl-policy
  - [ ] get
  - [ ] del
  - [ ] keys
  - [ ] import
  - [ ] export
  - [ ] watch
  - [ ] leave
  - [ ] drop
- [ ] authors  
  - [x] create
  - [x] delete
  - [ ] export
  - [ ] import
  - [x] default
  - [x] list
- [ ] blobs    
  - [ ] add
  - [ ] get
  - [ ] export
  - [ ] list
  - [ ] validate
  - [ ] consistency-check
  - [ ] delete
  - [ ] share
- [ ] node     
  - [ ] connections      
  - [ ] connection-info  
  - [ ] status           
  - [ ] stats            
  - [ ] shutdown         
  - [ ] node-addr        
  - [ ] add-node-addr    
  - [ ] home-relay       
- [ ] gossip   
  - [ ] subscribe
- [ ] tags     
  - [ ] list
  - [ ] delete
*/
