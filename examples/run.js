import {requestJson} from '../src/http.js';
const base = 'http://127.0.0.1:8787';
try {
  const all = [];
  let page = 1;
  while (page !== null) {
    const result = await requestJson(`${base}/items?page=${page}`);
    all.push(...result.data);
    page = result.nextPage;
  }
  console.log('Paginated items:', all);
  console.log('JSON echo:', await requestJson(`${base}/echo`, {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: {message: 'Hello API'},
  }));
  try { await requestJson(`${base}/bearer`); }
  catch (error) { console.log('Expected missing-auth error:', error.message); }
  console.log('Authenticated:', await requestJson(`${base}/bearer`, {
    headers: {Authorization: 'Bearer local-demo-token'},
  }));
} catch (error) { console.error(error.message); process.exitCode = 1; }
