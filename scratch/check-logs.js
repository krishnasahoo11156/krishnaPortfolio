const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  try {
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'domcontentloaded', timeout: 5000 });
    console.log('Page loaded successfully');
  } catch (e) {
    console.error('Error loading page:', e);
  }
  await browser.close();
})();
