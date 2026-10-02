import test from 'node:test';
import assert from 'node:assert/strict';
import {requestJson} from '../src/http.js';

test('HTTP failures do not expose response bodies', async () => {
  await assert.rejects(requestJson('https://example.invalid', {
    fetchImpl: async () => new Response('private-token-value', {status: 401}),
  }), error => error.message.includes('401') && !error.message.includes('private-token'));
});
test('network errors do not expose a URL containing a credential', async () => {
  await assert.rejects(requestJson('https://example.invalid', {
    fetchImpl: async () => { throw new Error('secret URL'); },
  }), error => !error.message.includes('secret'));
});
test('empty 204 and non-JSON successful responses are handled explicitly', async () => {
  assert.equal(await requestJson('https://example.invalid', {
    fetchImpl: async () => new Response(null, {status: 204}),
  }), null);
  await assert.rejects(requestJson('https://example.invalid', {
    fetchImpl: async () => new Response('<html>not JSON</html>'),
  }), /not valid JSON/);
});
