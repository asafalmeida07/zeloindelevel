import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://localhost:5173/cadastro', { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[placeholder="Seu nome"]');
  
  const testEmail = `test${Date.now()}@test.com`;
  await page.type('input[placeholder="Seu nome"]', 'Test User');
  await page.type('input[type="email"]', testEmail);
  await page.type('input[type="password"]', '123456');
  
  await new Promise(r => setTimeout(r, 500));
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button')
  ]);
  
  console.log('Registered and redirected to:', page.url());

  // Join Team Zelo
  await page.waitForSelector('input[placeholder="Código da equipe"]', { timeout: 5000 }).catch(()=>null);
  
  const inTeamGate = page.url().includes('equipe');
  if (inTeamGate) {
    await page.type('input', 'Zelo');
    await page.click('button');
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('Going to Plan...');
  await page.goto('http://localhost:5173/plano', { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[type="number"]');
  
  // Fill 3 cycles
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type="number"]');
    if (inputs.length > 0) {
      inputs[0].value = 3;
      const tracker = inputs[0]._valueTracker;
      if (tracker) tracker.setValue('');
      inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  
  await new Promise(r => setTimeout(r, 500));
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

  await page.goto('http://localhost:5173/apenas-continue', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'painel_ciclo.png' });
  console.log('Saved painel_ciclo.png');

  const content = await page.content();
  if (content.includes('Ciclo Atual') || content.includes('#1')) {
    console.log('Integration test passed: Cycle 1 is visible in dashboard.');
  } else {
    console.log('Integration test failed: Cycle not visible.');
  }

  await browser.close();
})();
