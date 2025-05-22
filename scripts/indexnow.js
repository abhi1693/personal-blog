const axios = require('axios');
const { parseStringPromise } = require('xml2js');
const { URLSearchParams } = require('url');

const HOST = 'blog.abhimanyu-saharan.com';
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const KEY = '1354292cdac5486f8457c7eb6d425b4d';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const INDEXNOW_GET_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

const INDEXNOW_POST_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

async function fetchUrlsFromSitemap(sitemapUrl) {
  try {
    const response = await axios.get(sitemapUrl, { timeout: 10000 });
    const xml = response.data;
    const result = await parseStringPromise(xml);
		return result.urlset.url.map((entry) => entry.loc[0].trim());
  } catch (err) {
    console.error('[ERROR] Failed to parse sitemap:', err.message);
    return [];
  }
}

async function submitGetRequests(urls) {
  for (const url of urls) {
    const params = new URLSearchParams({ url, key: KEY }).toString();
    for (const endpoint of INDEXNOW_GET_ENDPOINTS) {
      try {
        const fullUrl = `${endpoint}?${params}`;
        const res = await axios.get(fullUrl, { timeout: 5000 });
        console.log(`[GET] ${endpoint} => ${res.status} for ${url}`);
      } catch (err) {
        console.error(`[ERROR] GET to ${endpoint} failed: ${err.message}`);
      }
    }
  }
}

async function submitPostRequests(urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
  };

  for (const endpoint of INDEXNOW_POST_ENDPOINTS) {
    try {
      const res = await axios.post(endpoint, payload, { headers, timeout: 10000 });
      console.log(`[POST] ${endpoint} => ${res.status}`);
      if (res.status !== 200) {
        console.log(`[POST] Response: ${res.data}`);
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
    console.warn('[WARN] No URLs found to submit.');
    return;
  }

  console.log(`[INFO] Submitting ${urls.length} URLs to IndexNow (GET + POST)...`);
  await submitGetRequests(urls);
  await submitPostRequests(urls);
})();
