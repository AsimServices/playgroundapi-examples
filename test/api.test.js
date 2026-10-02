import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createMockApi} from '../src/server.js';
import {requestJson} from '../src/http.js';

test('local API supports pagination, JSON, and authentication failures', async t => {
  const server = createMockApi().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise(resolve => {server.close(resolve); server.closeAllConnections();}));
  const base = `http://127.0.0.1:${server.address().port}`;
  const first = await requestJson(`${base}/items?page=1`);
  assert.equal(first.data.length, 2);
  const second = await requestJson(`${base}/items?page=${first.nextPage}`);
  assert.equal(second.nextPage, null);
  assert.equal(second.data[0].id, 3);
  assert.deepEqual(await requestJson(`${base}/echo`, {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: {name: 'demo'},
  }), {json: {name: 'demo'}});
  await assert.rejects(requestJson(`${base}/bearer`), /401/);
  assert.equal((await requestJson(`${base}/bearer`, {
    headers: {Authorization: 'Bearer local-demo-token'},
  })).authenticated, true);
  assert.equal((await fetch(`${base}/echo`, {method: 'POST', body: '{'})).status, 400);
  assert.equal((await fetch(`${base}/items?page=0`)).status, 400);
});
