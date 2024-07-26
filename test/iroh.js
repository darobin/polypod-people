
import { ok, equal, rejects } from 'node:assert';
import { IrohNode } from '../lib/iroh.js';

let node;

before(async () => {
  node = new IrohNode();
  await node.start();
});
after(() => {
  if (node) node.stop();
});
describe('Runs Iroh', () => {
  it('should start and stop', async () => {
    const iroh = new IrohNode();
    await iroh.start();
    ok(iroh.started, 'started');
    // await iroh.shutdown();
    iroh.stop();
    ok(!iroh.started, 'stopped');
  });
});

describe('Iroh Authors', () => {
  it('should list authors', async () => {
    const authors = await node.listAuthors();
    equal(authors.length, 1, 'one default author');
    ok(authors[0].id, 'author id');
  });
  it('should have a default author', async () => {
    const authors = await node.listAuthors();
    const def = await node.defaultAuthor();
    equal(authors[0].id, def.id, 'correct default author');
  });
  it('should create an author', async () => {
    const newb = await node.createAuthor();
    const authors = await node.listAuthors();
    equal(authors.length, 2, 'two authors');
    ok(authors.find(au => newb.id === au.id), 'new author is listed');
    const def = await node.defaultAuthor();
    ok(authors.find(au => def.id === au.id), 'default author still listed');
  });
  it('should delete an author', async () => {
    const newb = await node.createAuthor();
    const authors = await node.listAuthors();
    ok(authors.find(au => newb.id === au.id), 'new author is listed');
    await node.deleteAuthor(newb.id);
    const authorsAfter = await node.listAuthors();
    ok(!authorsAfter.find(au => newb.id === au.id), 'new author deleted');
    await rejects(
      async () => node.deleteAuthor('whatevs'),
      {
        name: 'Error',
        message: 'Failed to delete author',
      }
    );
  });
});
