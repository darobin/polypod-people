
import { ok } from 'node:assert';
import { IrohNode } from '../lib/iroh.js';

describe('Runs Iroh', () => {
  it('should start and stop', async () => {
    const iroh = new IrohNode();
    await iroh.start();
    ok(iroh.started, 'started');
    await iroh.shutdown();
    ok(!iroh.started, 'stopped');
  });
});
