const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  
  // register a test user
  await page.goto('http://localhost:5173/cadastro', { waitUntil: 'networkidle2' });
  
  const testEmail = `test${Date.now()}@test.com`;
  await page.type('input[type="text"]', 'Test User');
  await page.type('input[type="email"]', testEmail);
  await page.type('input[type="password"]', '123456');
  
  // Wait for React to update states if needed
  await new Promise(r => setTimeout(r, 500));
  
  console.log('Submitting registration...');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Registered and redirected to:', page.url());

  // Join a team
  console.log('Joining team Zelo...');
  await page.waitForSelector('input[type="text"]');
  await page.type('input[type="text"]', 'Zelo'); // team code
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('Joined team, at:', page.url());

  // Go to plan
  console.log('Going to Plan...');
  await page.goto('http://localhost:5173/plano', { waitUntil: 'networkidle2' });
  
  // Fill 3 cycles
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="number"]');
    if (inputs.length > 0) {
      inputs[0].value = 3;
      // trigger react change
      const tracker = inputs[0]._valueTracker;
      if (tracker) tracker.setValue('');
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  
  await new Promise(r => setTimeout(r, 500));
  console.log('Generating plan...');
  const buttons = await page.$$('button');
  for (let b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Adicionar 3 Ciclos')) {
      await b.click();
      break;
    }
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'plano_gerado.png' });
  console.log('Saved plano_gerado.png');

  console.log('Going to Dashboard...');
  await page.goto('http://localhost:5173/apenas-continue', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'painel_ciclo.png' });
  console.log('Saved painel_ciclo.png');

  // Verify elements exist (e.g., Ciclo Atual)
  const content = await page.content();
  if (content.includes('Ciclo Atual') || content.includes('#1')) {
    console.log('Integration test passed: Cycle 1 is visible in dashboard.');
  } else {
    console.log('Integration test failed: Cycle not visible.');
  }

  await browser.close();
})();
