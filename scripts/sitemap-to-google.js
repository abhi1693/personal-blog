const { google } = require('googleapis');
const path = require('path');

async function submitSitemap() {
  // Load OAuth2 client
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'service-account.json'),
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });

  const authClient = await auth.getClient();
  const searchconsole = google.webmasters({ version: 'v3', auth: authClient });

  const siteUrl = 'sc-domain:blog.abhimanyu-saharan.com';
  const sitemapUrl = 'https://blog.abhimanyu-saharan.com/sitemap.xml';

  try {
    await searchconsole.sitemaps.submit({
      siteUrl,
      feedpath: sitemapUrl,
    });
    console.log('✅ Sitemap submitted successfully.');
  } catch (error) {
    console.error('❌ Failed to submit sitemap:', error.errors || error.message);
  }
}

submitSitemap();
