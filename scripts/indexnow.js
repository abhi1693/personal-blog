const axios = require('axios');
const { parseStringPromise } = require('xml2js');

const HOST = 'blog.abhimanyu-saharan.com';
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const KEY = '1354292cdac5486f8457c7eb6d425b4d';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

async function fetchUrlsFromSitemap(url) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const result = await parseStringPromise(response.data);
    return result.urlset.url.map(entry => entry.loc[0].trim());
  } catch (err) {
    console.error('[ERROR] Failed to fetch or parse sitemap:', err.message);
    return [];
  }
}

async function submitUrlsViaPost(urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const res = await axios.post(endpoint, payload, { headers, timeout: 10000 });
      console.log(`[POST] ${endpoint} => ${res.status}`);
      if (res.status !== 200) {
        console.log(`[POST] Response body: ${JSON.stringify(res.data)}`);
      }
    } catch (err) {
      console.error(`[ERROR] POST to ${endpoint} failed: ${err.message}`);
    }
  }

  console.log(`[INFO] Total URLs submitted: ${urls.length}`);
}

(async function main() {
  const urls = await fetchUrlsFromSitemap(SITEMAP_URL);

  if (!urls.length) {
    console.warn('[WARN] No URLs found in sitemap.');
    return;
  }

  console.log(`[INFO] Submitting ${urls.length} URLs to IndexNow via POST...`);
  await submitUrlsViaPost(urls);
})();
