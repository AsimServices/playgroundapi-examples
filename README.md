# API Playground examples

Learn HTTP by running requests against a tiny local API you can inspect. Examples
cover query parameters, JSON bodies, Bearer authentication, pagination, and errors.
No account, API key, npm packages, or external service is needed for the local lab.

## Run the lab

Install Node.js 22 or newer, clone this repository, and open two terminals in it:

```sh
git clone https://github.com/AsimServices/playgroundapi-examples.git
cd playgroundapi-examples
node src/server.js
```

In the second terminal:

```sh
node examples/run.js
npm test
```

Expect three paginated items, a JSON echo, an intentional HTTP 401, and an
authenticated result. Stop the server with Ctrl+C. The server binds only to your
own computer and stores nothing on disk.

## Explore individual requests

| File | Purpose |
| --- | --- |
| [requests.http](examples/requests.http) | Requests for editors with an HTTP client extension |
| [Postman collection](examples/http-basics.postman_collection.json) | Importable requests with no private credentials |
| [run.js](examples/run.js) | JavaScript requests and a pagination loop |
| [server.js](src/server.js) | Readable mock API implementation |

Change a query parameter, remove the Authorization header, or send malformed JSON.
Predict the status code before sending, then compare it with the actual response.
The `local-demo-token` string is intentionally public and authenticates only this lab.

## Try it in a browser

Try these requests interactively using [PlaygroundAPI.com](https://playgroundapi.com/playground).
For the hosted tool, start with `GET https://jsonplaceholder.typicode.com/posts/1`;
expect a JSON object containing `id: 1`. That public service is operated separately
and its availability can change. Local `127.0.0.1` examples must be run with a local
client: the hosted Playground proxy cannot reach your computer's loopback server.

In Playground, select the method, paste the public URL, and click Send. Inspect the
status, response headers, and JSON. Requests entered there pass through Playground's
server; use public examples or sandbox credentials. The scripts here run directly
from your machine and do not call Playground.

## What the examples teach

- A 200 response still needs a body check; status alone is not a schema assertion.
- Pagination requires following the API's documented continuation mechanism.
- A 401 should be diagnosed before retrying; adding more retries does not fix auth.
- Server-side success does not establish that browser CORS is configured correctly.

The mock intentionally omits persistence, production authentication, and CORS.
It is a learning fixture, not a production API server. Tests use local loopback only.

## Continue learning

- [API-testing guide](https://playgroundapi.com/blog/from-api-docs-to-verified-response-in-60-seconds)
- [Webhook testing examples](https://github.com/AsimServices/webhook-testing-examples)
- [API testing cheatsheet](https://github.com/AsimServices/api-testing-cheatsheet)
- [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)

MIT licensed. Contributions with reproducible examples are welcome.
