export async function requestJson(url, {method = 'GET', headers = {}, body,
  fetchImpl = fetch, timeoutMs = 15000} = {}) {
  let response;
  try {
    response = await fetchImpl(url, {
      method, redirect: 'error', signal: AbortSignal.timeout(timeoutMs),
      headers: {Accept: 'application/json', ...headers},
      ...(body === undefined ? {} : {body: JSON.stringify(body)}),
    });
  } catch {
    throw new Error('Request failed: network, timeout, or redirect. Check the endpoint.');
  }
  if (!response.ok) {
    // Avoid printing a provider body that might echo credentials or private input.
    throw new Error(`HTTP ${response.status}: check authentication, permissions, payload, and quota.`);
  }
  if (response.status === 204) return null;
  try { return await response.json(); }
  catch { throw new Error('The successful response was not valid JSON.'); }
}

export function required(value, name) {
  if (typeof value !== 'string' || !value.trim() || value.startsWith('REPLACE_')) {
    throw new Error(`Set ${name} before running this example.`);
  }
  return value.trim();
}
