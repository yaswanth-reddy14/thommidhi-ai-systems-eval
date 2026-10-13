
const { chromium } = require('@playwright/test');
const fs = require('node:fs/promises');
const readline = require('node:readline/promises');

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    await page.goto('https://thommidhi.com/lab', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    console.log('\nA separate Chromium browser is open.');
    console.log('Sign in manually if prompted.');
    console.log('Do not share passwords or verification codes.');

    while (true) {
      console.log('\nCurrent URL:', page.url());
      await rl.question(
        'When ready, press Enter to check the page; type q to quit: '
      );

      if (page.isClosed()) break;

      if (page.url().includes('accounts.google.com')) {
        console.log(
          'Still on Google sign-in. Finish sign-in in the browser first.'
        );
        continue;
      }

      const text = await page.locator('body').innerText();

      if (text.length < 30) {
        console.log('Page content is not ready yet. Try again.');
        continue;
      }

      await fs.writeFile(
        'page-report.json',
        JSON.stringify({
          url: page.url(),
          title: await page.title(),
          text: text.slice(0, 12000),
          capturedAt: new Date().toISOString()
        }, null, 2),
        'utf8'
      );

      await page.screenshot({
        path: 'thommidhi-screen.png',
        fullPage: true
      });

      console.log('Saved page-report.json and thommidhi-screen.png');
      console.log('Current page title:', await page.title());

      const answer = await rl.question(
        'Capture another page? Type y, or q to quit: '
      );

      if (answer.trim().toLowerCase() === 'q') break;
      if (answer.trim().toLowerCase() !== 'y') break;

      console.log('Navigate manually in the browser, then return here.');
    }
  } finally {
    rl.close();
    await browser.close();
  }
}

main().catch(error => {
  console.error('Automation failed:', error.message);
  process.exitCode = 1;
});
