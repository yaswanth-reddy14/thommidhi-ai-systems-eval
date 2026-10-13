
const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');

async function main() {
  const browser = await chromium.launch({
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false
  });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://thommidhi.com/lab', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    console.log('Title:', await page.title());
    console.log('URL:', page.url());
    console.log('If sign-in is required, complete it manually.');

    await page.waitForTimeout(3000);

    console.log('Current URL:', page.url());
    console.log('Current title:', await page.title());

    const report = {
      title: await page.title(),
      url: page.url(),
      text: (await page.locator('body').innerText()).slice(0, 8000),
      capturedAt: new Date().toISOString()
    };

    await fs.writeFile(
      'chrome-inspection.json',
      JSON.stringify(report, null, 2),
      'utf8'
    );

    await page.screenshot({
      path: 'chrome-inspection.png',
      fullPage: true
    });

    console.log('Saved chrome-inspection.json and chrome-inspection.png');
    await page.waitForTimeout(10000);
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
