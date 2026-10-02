import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';

const items = [{id: 1, name: 'Notebook'}, {id: 2, name: 'Pencil'}, {id: 3, name: 'Eraser'}];
export function createMockApi() {
  return createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const send = (status, body) => {
      res.writeHead(status, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(body));
    };
    if (req.method === 'GET' && url.pathname === '/items') {
      const page = Number(url.searchParams.get('page') ?? 1);
      if (!Number.isSafeInteger(page) || page < 1) return send(400, {error: 'page must be a positive integer'});
      return send(200, {data: items.slice((page - 1) * 2, page * 2),
        nextPage: page * 2 < items.length ? page + 1 : null});
    }
    if (req.method === 'GET' && url.pathname === '/bearer') {
      return req.headers.authorization === 'Bearer local-demo-token'
        ? send(200, {authenticated: true}) : send(401, {error: 'missing or incorrect bearer token'});
    }
    if (req.method === 'POST' && url.pathname === '/echo') {
      let body = '';
      for await (const chunk of req) {
        body += chunk;
        if (Buffer.byteLength(body) > 65536) return send(413, {error: 'body too large'});
      }
      try { return send(200, {json: JSON.parse(body)}); }
      catch { return send(400, {error: 'invalid JSON'}); }
    }
    return send(404, {error: 'route not found'});
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createMockApi().listen(8787, '127.0.0.1', () => console.log('Mock API: http://127.0.0.1:8787'));
}
